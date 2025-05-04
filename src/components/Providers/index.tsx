'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import SharedWorkerProvider from './SharedWorkerProvider';

function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SharedWorkerProvider>{children}</SharedWorkerProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default Providers;
