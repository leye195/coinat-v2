import type { AppProps } from 'next/app';
import MetaTags from '@/components/Metatags';
import Providers from '@/components/Providers';
import type { NextPageWithLayout } from '@/types/Page';

import '@/styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Providers>
      <MetaTags />
      {getLayout(<Component {...pageProps} />)}
    </Providers>
  );
}

export default MyApp;
