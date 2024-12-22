'use client';

import { useInitCoinList } from 'hooks/queries';

const Worker = () => {
  useInitCoinList({
    workerEnabled: true,
    initialData: {
      krw: [],
      btc: [],
      usdt: [],
    },
  });
  return null;
};

export default Worker;
