'use client';

import { useInitCoinList } from '@/hooks';
import type { Coin } from '@/types/Coin';

type InitializeProps = {
  btc: Coin[];
  krw: Coin[];
};

function InitializeClient({ btc, krw }: InitializeProps) {
  useInitCoinList({
    initialData: {
      krw,
      btc,
    },
    workerEnabled: false,
  });
  return null;
}

export default InitializeClient;
