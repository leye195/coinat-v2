import { globalTheme } from '@/styles/theme';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import type { AppProps } from 'next/app';
import styles from 'styles';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EmotionThemeProvider theme={globalTheme}>
      <Global styles={styles} />
      <Component {...pageProps} />
    </EmotionThemeProvider>
  );
}

export default MyApp;
