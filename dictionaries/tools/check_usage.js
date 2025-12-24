
const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.join(__dirname, '..', '..');
const DICT_PATH = path.join(ROOT_DIR, 'dictionaries', 'en.json');
const SOURCE_DIRS = [path.join(ROOT_DIR, 'app'), path.join(ROOT_DIR, 'components'), path.join(ROOT_DIR, 'lib')];
const IGNORE_EXTENSIONS = ['.json', '.css', '.md'];

// Helper to flatten object keys
function flattenKeys(obj, prefix = '') {
    let keys = {};
    for (const key in obj) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(keys, flattenKeys(obj[key], fullPath));
            // Also add the object key itself
            keys[fullPath] = 'OBJECT';
        } else {
            keys[fullPath] = 'LEAF';
        }
    }
    return keys;
}

// Helper to get all source files
function getSourceFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getSourceFiles(filePath, fileList);
        } else {
            if (!IGNORE_EXTENSIONS.includes(path.extname(file))) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// Load Dictionary
console.log(`Reading dictionary from ${DICT_PATH}`);
const dictContent = fs.readFileSync(DICT_PATH, 'utf8');
const dict = JSON.parse(dictContent);
const allKeys = flattenKeys(dict);

// Load Source Content
const sourceFiles = [];
SOURCE_DIRS.forEach(dir => getSourceFiles(dir, sourceFiles));
console.log(`Scanned ${sourceFiles.length} source files.`);

let allSourceContent = '';
sourceFiles.forEach(file => {
    allSourceContent += fs.readFileSync(file, 'utf8') + '\n';
});

// Analyze Usage
const usedMap = {}; // path -> boolean

Object.keys(allKeys).forEach(key => {
    const isPresent = allSourceContent.includes(key);
    usedMap[key] = isPresent;
});

// Determine truly unused (no explicit usage AND no used children)
const unused = [];

Object.keys(allKeys).forEach(key => {
    if (usedMap[key]) return; // It is explicitly present

    // Check if any used key starts with this key + '.'
    const hasUsedChild = Object.keys(usedMap).some(otherKey =>
        usedMap[otherKey] && otherKey.startsWith(key + '.')
    );

    if (!hasUsedChild) {
        unused.push(key);
    }
});

console.log("Possibly Unused Keys (No explicit usage, no used children):");
unused.forEach(k => console.log(k));
