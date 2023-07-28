/** @type {import('next').NextConfig} */
const nextConfig = {
   env: {
      NEXT_APP_BACKEND_URL: process.env.NEXT_APP_BACKEND_URL,
   },
};

module.exports = nextConfig;
