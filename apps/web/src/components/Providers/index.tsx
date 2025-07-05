'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SharedWorkerProvider from './SharedWorkerProvider';

function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SharedWorkerProvider>{children}</SharedWorkerProvider>
    </QueryClientProvider>
  );
}

export default Providers;
