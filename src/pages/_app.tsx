import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { RecoilRoot } from 'recoil';
import MetaTag from '@/components/Metatag';
import { globalTheme } from '@/styles/theme';
import { NextPageWithLayout } from '@/types/Page';
import styles from 'styles';

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
          <Global styles={styles} />
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </RecoilRoot>
    </EmotionThemeProvider>
  );
}

export default MyApp;
