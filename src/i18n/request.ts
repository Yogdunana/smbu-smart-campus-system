import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import fs from 'fs';
import path from 'path';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Read JSON files directly for standalone compatibility
  const filePath = path.join(process.cwd(), 'src/i18n/messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  return {
    locale,
    messages,
  };
});
