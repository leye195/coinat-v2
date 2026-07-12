'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useMounted } from 'ownui-system';
import { useQuery } from '@tanstack/react-query';
import { createTickerSource } from '@/lib/ticker-source/createTickerSource';
import { TickerSource } from '@/lib/ticker-source/types';
import { useCryptoSocketStore } from '@/store/socket';

export default function SharedWorkerProvider({ children }: PropsWithChildren) {
  const isMounted = useMounted();
  const sourceRef = useRef<TickerSource | null>(null);
  const [ready, setReady] = useState(false);
  const { setSocketState } = useCryptoSocketStore();

  useQuery({
    queryKey: ['crypto-ws'],
    queryFn: () => {
      sourceRef.current?.requestTickers();
      return true;
    },
    enabled: ready,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!isMounted) return;

    // Progressive source: SharedWorker → Dedicated Worker → main thread.
    // Unsupported browsers silently fall back instead of crashing the error boundary.
    const source = createTickerSource(({ upbit, binance }) => {
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
    });

    sourceRef.current = source;
    setReady(true);

    const handleUnload = () => source.disconnect();
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('unload', handleUnload);
      source.disconnect();
      sourceRef.current = null;
      setReady(false);
    };
  }, [isMounted, setSocketState]);

  return <>{children}</>;
}
