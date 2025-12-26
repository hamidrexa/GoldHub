export const LANGS = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'tr', label: 'Türkçe', dir: 'ltr' },
];

export const DEFAULT_LANG = 'en';

export function withLangPrefix(lang: string, path: string) {
    if (lang === DEFAULT_LANG) return path;
    return `/${lang}${path}`;
}

export function stripLangFromPath(path: string) {
    return path.replace(/^\/(en|ar|tr)(?=\/|$)/, '');
}

