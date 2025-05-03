'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMounted } from 'ownui-system';

export default function SharedWorkerProvider({ children }: PropsWithChildren) {
  const isMounted = useMounted();
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);

  useQuery({
    queryKey: ['test'],
    queryFn: () => {
      sharedWorker?.port.postMessage({
        type: 'tickers',
      });
      return true;
    },
    enabled: sharedWorker != null,
    refetchInterval: 3000,
  });

  useEffect(() => {
    //if (sharedWorker.current) return;
    if (!isMounted) return;

    const worker = new SharedWorker(
      new URL('/public/workers/workers/shared.worker.js', import.meta.url),
      { type: 'module' },
    );

    worker.port.onmessage = (event) => {
      console.log('Received message from worker:', event);
    };

    worker.port.postMessage({
      type: 'ping',
    });

    setSharedWorker(worker);

    window.addEventListener('unload', () => {
      worker.port.postMessage({ type: 'disconnect' });
    });

    return () => {
      worker.port.postMessage({
        type: 'disconnect',
      });
    };
  }, [isMounted]);

  return <>{children}</>;
}
