import type { NextConfig } from "next";
//import nextI18nConfig from './next-i18next.config';
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        pathname: '/**',
      }
      
    ],
  },
};

export default withNextIntl(nextConfig);
