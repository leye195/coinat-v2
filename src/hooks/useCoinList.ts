import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { initSocket } from '@/lib/socket';
import { btcCoinListState, krCoinListState } from '@/store/coin';

const useCoinList = () => {
  const workerRef = useRef<Worker | null>(null);
  const [krwCoinData, setKrwCoinList] = useRecoilState(krCoinListState);
  const [btcCoinData, setBtcCoinList] = useRecoilState(btcCoinListState);

  useEffect(() => {
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
    };
    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error.message);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setBtcCoinList, setKrwCoinList]);

  return { krwCoinData, btcCoinData };
};

export default useCoinList;
