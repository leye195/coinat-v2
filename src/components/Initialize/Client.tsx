'use client';

import { useQuery } from '@tanstack/react-query';
import { useInitCoinList } from '@/hooks';
import { getCoins } from '@/lib/coin';
import type { Coin } from '@/types/Coin';

type InitializeProps = {
  btc: Coin[];
  krw: Coin[];
};

function InitializeClient({ btc, krw }: InitializeProps) {
  const { data } = useQuery({
    queryKey: ['coin-list'],
    queryFn: async () => {
      const krwData = await getCoins('KRW');
      const btcData = await getCoins('BTC');
      return {
        btc: btcData,
        krw: krwData,
      };
    },
    placeholderData: {
      btc,
      krw,
    },
  });

  useInitCoinList({
    initialData: {
      krw: data?.krw ?? krw,
      btc: data?.btc ?? btc,
    },
    workerEnabled: false,
  });
  return null;
}

export default InitializeClient;
