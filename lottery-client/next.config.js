/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ['static.vecteezy.com', 'static.vecteezy.com'],
   },
   env: {
      NEXT_APP_BACKEND_URL: process.env.NEXT_APP_BACKEND_URL,
   },
   compiler: {
      styledComponents: true,
   },
};

module.exports = nextConfig;
