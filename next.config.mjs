import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingIncludes: {
      '*': ['./src/i18n/messages/**/*'],
    },
  },
  serverExternalPackages: ['bcryptjs'],
};

export default withNextIntl(nextConfig);
