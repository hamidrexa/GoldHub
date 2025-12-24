const fs = require('fs');
const path = require('path');

const DICT_DIR = path.join(process.cwd(), 'dictionaries');
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

function compareDictionaries(source, target, dictName, path = '') {
    const missingKeys = [];
    const extraKeys = [];

    // Check for missing keys (in source but not in target)
    Object.keys(source).forEach(key => {
        const fullPath = path ? `${path}.${key}` : key;
        if (!(key in target)) {
            missingKeys.push(fullPath);
        } else if (
            typeof source[key] === 'object' && source[key] !== null &&
            !Array.isArray(source[key]) &&
            typeof target[key] === 'object' && target[key] !== null &&
            !Array.isArray(target[key])
        ) {
            const result = compareDictionaries(source[key], target[key], dictName, fullPath);
            missingKeys.push(...result.missingKeys);
            extraKeys.push(...result.extraKeys);
        }
    });

    // Check for extra keys (in target but not in source)
    Object.keys(target).forEach(key => {
        const fullPath = path ? `${path}.${key}` : key;
        if (!(key in source)) {
            extraKeys.push(fullPath);
        }
    });

    return { missingKeys, extraKeys };
}

function main() {
    console.log(`Reference: ${path.basename(SOURCE_FILE)}`);
    const sourceDict = loadJson(SOURCE_FILE);

    TARGET_FILES.forEach(targetPath => {
        const dictName = path.basename(targetPath);
        console.log(`\n--- Diffing ${dictName} ---`);
        const targetDict = loadJson(targetPath);

        if (Object.keys(targetDict).length === 0) {
            console.log('File not found or empty.');
            return;
        }

        const { missingKeys, extraKeys } = compareDictionaries(sourceDict, targetDict, dictName);

        if (extraKeys.length > 0) {
            console.log(`\x1b[31m[EXTRA KEYS] (Should be removed): ${extraKeys.length}\x1b[0m`);
            extraKeys.slice(0, 50).forEach(k => console.log(`  - ${k}`));
            if (extraKeys.length > 50) console.log(`  ... and ${extraKeys.length - 50} more.`);
        } else {
            console.log('\x1b[32m[OK] No extra keys found.\x1b[0m');
        }

        if (missingKeys.length > 0) {
            console.log(`\x1b[33m[MISSING KEYS] (Need translation): ${missingKeys.length}\x1b[0m`);
            // Only show first 10 missing to avoid spamming console during dev
            missingKeys.slice(0, 10).forEach(k => console.log(`  + ${k}`));
            if (missingKeys.length > 10) console.log(`  ... and ${missingKeys.length - 10} more.`);
        } else {
            console.log('\x1b[32m[OK] No missing keys found.\x1b[0m');
        }
    });
}

main();
