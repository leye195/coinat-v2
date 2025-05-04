'use client';

import { useInitCoinList } from 'hooks/queries';

const Worker = () => {
  useInitCoinList({
    initialData: {
      krw: [],
      btc: [],
      usdt: [],
    },
  });
  return null;
};

export default Worker;
