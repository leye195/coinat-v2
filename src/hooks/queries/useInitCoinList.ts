'use client';

import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { initSocket } from '@/lib/socket';
import { getLocalStorageData, setLocalStorageData } from '@/lib/storage';
import { btcCoinListState, krCoinListState } from '@/store/coin';
import { Coin } from '@/types/Coin';

type UseInitCointListProps = {
  workerEnabled?: boolean;
  initialData: Record<'krw' | 'btc', Coin[]>;
};

const useInitCoinList = ({
  workerEnabled = true,
  initialData,
}: UseInitCointListProps) => {
  const workerRef = useRef<Worker | null>(null);
  const setKrwCoinList = useSetRecoilState(krCoinListState);
  const setBtcCoinList = useSetRecoilState(btcCoinListState);

  useEffect(() => {
    if (
      workerEnabled ||
      initialData.krw.length === 0 ||
      initialData.btc.length === 0
    ) {
      return;
    }

    const { krw, btc } = initialData;

    setKrwCoinList({
      isLoading: false,
      data: krw,
    });
    setBtcCoinList({ isLoading: false, data: btc });
    initSocket([...krw, ...btc]);
  }, [workerEnabled, initialData, setBtcCoinList, setKrwCoinList]);

  useEffect(() => {
    if (!workerEnabled) return;

    const localData = getLocalStorageData('coins');

    if (localData) {
      const { krw, btc } = localData;
      setKrwCoinList({
        isLoading: false,
        data: krw,
      });
      setBtcCoinList({ isLoading: false, data: btc });
    }

    workerRef.current = new Worker(
      new URL('/public/workers/workers/crypto.worker.js', import.meta.url),
    );

    if (workerRef.current) workerRef.current.postMessage('start');

    workerRef.current.onmessage = (event) => {
      const { krw, btc } = event.data;

      setKrwCoinList({
        isLoading: false,
        data: krw,
      });
      setBtcCoinList({ isLoading: false, data: btc });
      initSocket([...krw, ...btc]);
      setLocalStorageData(
        'coins',
        JSON.stringify({
          krw,
          btc,
        }),
      );
    };
    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error.message);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [workerEnabled, setBtcCoinList, setKrwCoinList]);
};

export default useInitCoinList;
