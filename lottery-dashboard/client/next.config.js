/** @type {import('next').NextConfig} */
const nextConfig = {
   env: {
      NEXT_APP_BACKEND_URL: process.env.NEXT_APP_BACKEND_URL,
      NEXT_APP_SECRET: process.env.NEXT_APP_SECRET,
   },
   eslint: {
      ignoreDuringBuilds: true,
   },
};

module.exports = nextConfig;
