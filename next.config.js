/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
    removeConsole: process.env.NEXT_PUBLIC_ENV === 'production',
  },
};

module.exports = nextConfig;
