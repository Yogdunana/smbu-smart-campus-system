import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh', 'en', 'ru'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
});
