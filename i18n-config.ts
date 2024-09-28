export const i18n = {
    defaultLocale: 'fa',
    locales: ['fa', 'tr', 'ar'],
} as const;
export type Locale = (typeof i18n)['locales'][number];
