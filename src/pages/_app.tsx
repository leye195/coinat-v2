import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { RecoilRoot } from 'recoil';
import MetaTags from '@/components/Metatags';
import { globalTheme } from '@/styles/theme';
import type { NextPageWithLayout } from '@/types/Page';

import '@/styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <EmotionThemeProvider theme={globalTheme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <MetaTags />
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </RecoilRoot>
    </EmotionThemeProvider>
  );
}

export default MyApp;
