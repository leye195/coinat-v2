import { globalTheme } from '@/styles/theme';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';

import { NextPageWithLayout } from 'types/Page';

import styles from 'styles';
import MetaTag from '@/components/Metatag';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <EmotionThemeProvider theme={globalTheme}>
      <RecoilRoot>
        <MetaTag />
        <Global styles={styles} />
        {getLayout(<Component {...pageProps} />)}
      </RecoilRoot>
    </EmotionThemeProvider>
  );
}

export default MyApp;
