/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
    removeConsole: process.env.NEXT_PUBLIC_ENV === 'production',
  },
  images: {
    domains: ['static.upbit.com'],
    path: '/_next/image',
    loader: 'default',
    minimumCacheTTL: 3600,
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
