import type { Metadata, Viewport } from 'next';
import { Suspense, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import ExchangeListServer from '@/components/ExchangeList/ExchangeList.server';
import FearGreedServer from '@/components/FearGreed/FearGreed.server';
import Initialize from '@/components/Initialize';
import Layout from '@/components/Layout';
import { NavigationEvents } from '@/components/NavigationEvents';
import Providers from '@/components/Providers';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CoinAT',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Initialize />
          <Suspense>
            <NavigationEvents />
          </Suspense>
          <Layout>
            <FearGreedServer />
            <ExchangeListServer />
            {children}
          </Layout>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
