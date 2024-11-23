'use client';

import { PropsWithChildren, useState } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { globalTheme } from '@/styles/theme';

function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <EmotionThemeProvider theme={globalTheme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </RecoilRoot>
    </EmotionThemeProvider>
  );
}

export default Providers;
