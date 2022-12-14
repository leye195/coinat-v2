import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { globalTheme } from '@/styles/theme';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';
import styles from 'styles';
import { NextPageWithLayout } from 'types/Page';

import MetaTag from '@/components/Metatag';
import Initialize from '@/components/Initialize';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(new QueryClient());

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <EmotionThemeProvider theme={globalTheme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <MetaTag />
          <Initialize />
          <Global styles={styles} />
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </RecoilRoot>
    </EmotionThemeProvider>
  );
}

export default MyApp;
