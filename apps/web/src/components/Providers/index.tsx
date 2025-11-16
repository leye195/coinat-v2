'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DevelopmentContainer from '@/components/DevelopmentContainer';
import SharedWorkerProvider from '@/components/Providers/SharedWorkerProvider';
import RootErrorBoundary from '@/components/RootErrorBoundary';
import { rootErrorHandler } from '@/lib/error';
import Button from '../Button';

function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <RootErrorBoundary
      errorHandler={rootErrorHandler}
      FallbackComponent={({ error }) => (
        <DevelopmentContainer
          fallback={<DevelopmentErrorFallback error={error} />}
        >
          <GlobalErrorFallback />
        </DevelopmentContainer>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <SharedWorkerProvider>{children}</SharedWorkerProvider>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
}

export default Providers;

function GlobalErrorFallback() {
  const handleReload = () => {
    if (typeof window === 'undefined') return;
    window.location.reload();
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 px-6 py-12 text-center text-white">
      <div className="space-y-2">
        <p className="text-2xl font-semibold">일시적인 오류가 발생했어요.</p>
        <p className="text-base text-white/70">
          페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
        </p>
      </div>
      <Button
        onClick={handleReload}
        className="rounded border border-white/20 bg-white/10 px-6 py-3 text-white transition hover:bg-white/20"
      >
        새로고침
      </Button>
    </section>
  );
}

function DevelopmentErrorFallback({ error }: { error: Error }) {
  return (
    <div className="w-full max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6 text-left text-red-900 shadow-lg">
      <p className="text-lg font-semibold text-red-800">{error.name}</p>
      <p className="mt-2 whitespace-pre-line text-sm">{error.message}</p>
      {error.stack && (
        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap text-xs">
          {error.stack}
        </pre>
      )}
    </div>
  );
}
