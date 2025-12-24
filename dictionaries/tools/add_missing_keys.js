const fs = require('fs');
const path = require('path');

const DICT_DIR = path.join(__dirname, '..');
const SOURCE_FILE = path.join(DICT_DIR, 'en.json');
const TARGET_FILES = ['fa.json', 'tr.json', 'ar.json'].map(f => path.join(DICT_DIR, f));

function loadJson(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
    return {};
}

function saveJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function getValueAtPath(obj, pathArray) {
    let current = obj;
    for (const key of pathArray) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }
    return current;
}

function setValueAtPath(obj, pathArray, value) {
    let current = obj;
    for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    const lastKey = pathArray[pathArray.length - 1];
    current[lastKey] = value;
}

function addMissingKeys(source, target, path = []) {
    let addedCount = 0;

    for (const key in source) {
        const currentPath = [...path, key];
        const pathString = currentPath.join('.');

        if (!(key in target)) {
            // Key is missing, add it
            console.log(`[ADD] ${pathString}`);
            target[key] = source[key];
            addedCount++;
        } else if (typeof source[key] === 'object' && source[key] !== null &&
            !Array.isArray(source[key]) &&
            typeof target[key] === 'object' && target[key] !== null &&
            !Array.isArray(target[key])) {
            // Both are objects, recurse
            addedCount += addMissingKeys(source[key], target[key], currentPath);
        }
    }

    return addedCount;
}

function main() {
    console.log(`Loading reference: ${SOURCE_FILE}`);
    const sourceDict = loadJson(SOURCE_FILE);

    TARGET_FILES.forEach(targetPath => {
        console.log(`\n--- Processing ${path.basename(targetPath)} ---`);
        const targetDict = loadJson(targetPath);

        if (Object.keys(targetDict).length === 0) {
            console.log('Skipping empty or non-existent file.');
            return;
        }

        const addedCount = addMissingKeys(sourceDict, targetDict);

        if (addedCount > 0) {
            saveJson(targetPath, targetDict);
            console.log(`✓ Added ${addedCount} missing keys to ${path.basename(targetPath)}`);
        } else {
            console.log(`✓ No missing keys in ${path.basename(targetPath)}`);
        }
    });

    console.log('\n✓ Done! Run diff_dictionaries.js to verify.');
}

main();
