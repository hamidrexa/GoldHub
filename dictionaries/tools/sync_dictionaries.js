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

function removeExtraKeys(source, target, path = '') {
    if (typeof target !== 'object' || target === null) return;

    // Loop through keys in target copy to safely delete
    Object.keys(target).forEach(key => {
        const fullPath = path ? `${path}.${key}` : key;

        // If key doesn't exist in source, delete it
        if (!(key in source)) {
            console.log(`[DELETE] ${fullPath}`);
            delete target[key];
            return;
        }

        // If both are objects, recurse
        if (typeof source[key] === 'object' && source[key] !== null &&
            typeof target[key] === 'object' && target[key] !== null &&
            !Array.isArray(source[key])) { // Assuming arrays are atomic for translation chunks or handled differently
            // Note: Arrays in JSON translation usually treated as atomic values or list of strings
            // If array, we usually don't partial sync inside it unless it's an array of objects which is rare in simple i18n
            if (!Array.isArray(target[key])) {
                removeExtraKeys(source[key], target[key], fullPath);
            }
        }
    });
}

function main() {
    console.log(`Loading reference: ${SOURCE_FILE}`);
    const sourceDict = loadJson(SOURCE_FILE);

    TARGET_FILES.forEach(targetPath => {
        console.log(`\nProcessing ${path.basename(targetPath)}...`);
        const targetDict = loadJson(targetPath);

        // Simple sanity check to ensure we loaded something
        if (Object.keys(targetDict).length === 0) {
            console.log('Skipping empty or non-existent file.');
            return;
        }

        removeExtraKeys(sourceDict, targetDict);
        saveJson(targetPath, targetDict);
        console.log(`Saved ${path.basename(targetPath)}`);
    });
}

main();
