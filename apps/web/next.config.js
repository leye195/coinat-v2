/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
        ],
      },
      // web worker
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
        options: {
          inline: 'fallback', // 워커를 별도의 파일로 분리
        },
      },
    );

    return config;
  },
  compiler: {
    emotion: true,
    // `next build` sets NODE_ENV=production, so this strips console.* from
    // production bundles regardless of NEXT_PUBLIC_ENV. console.error is kept
    // for production diagnostics.
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.upbit.com',
        port: '',
      },
    ],
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
