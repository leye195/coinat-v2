'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useMounted } from 'ownui-system';
import { useQuery } from '@tanstack/react-query';
import { useCryptoSocketStore } from '@/store/socket';

export default function SharedWorkerProvider({ children }: PropsWithChildren) {
  const isMounted = useMounted();
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);
  const { setSocketState } = useCryptoSocketStore();

  useQuery({
    queryKey: ['crypto-ws'],
    queryFn: () => {
      sharedWorker?.port.postMessage({
        type: 'tickers',
      });
      return true;
    },
    enabled: sharedWorker != null,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!isMounted) return;

    const worker = new SharedWorker(
      new URL('/public/workers/workers/shared.worker.js', import.meta.url),
      { type: 'module' },
    );

    worker.port.onmessage = (event) => {
      const { payload, type } = event.data;

      if (type === 'tickers') {
        const { upbit, binance } = payload;

        setSocketState({
          tickers: {
            upbit: upbit.data,
            binance: binance.data,
          },
          btcKrw: {
            upbit: upbit.btcKrw,
            binance: binance.btcKrw,
          },
        });
      }
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
  }, [isMounted, setSocketState]);

  return <>{children}</>;
}
