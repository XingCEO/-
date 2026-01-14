export const i18n = {
  defaultLocale: 'zh-TW',
  locales: ['en', 'zh-TW'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
