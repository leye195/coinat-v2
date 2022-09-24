import { globalTheme } from '@/styles/theme';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import type { AppProps } from 'next/app';
import styles from 'styles';
import { NextPageWithLayout } from 'types/Page';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <EmotionThemeProvider theme={globalTheme}>
      <Global styles={styles} />
      {getLayout(<Component {...pageProps} />)}
    </EmotionThemeProvider>
  );
}

export default MyApp;
