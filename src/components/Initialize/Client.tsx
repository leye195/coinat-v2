'use client';

import { useQuery } from '@tanstack/react-query';
import { useInitCoinList } from '@/hooks';
import { getCoins } from '@/lib/coin';
import type { Coin } from '@/types/Coin';

type InitializeProps = {
  btc: Coin[];
  krw: Coin[];
  usdt: Coin[];
};

function InitializeClient({ btc, krw, usdt }: InitializeProps) {
  const { data } = useQuery({
    queryKey: ['coin-list'],
    queryFn: async () => {
      const krwData = await getCoins('KRW');
      const btcData = await getCoins('BTC');
      const usdtData = await getCoins('USDT');

      return {
        btc: btcData,
        krw: krwData,
        usdt: usdtData,
      };
    },
    placeholderData: {
      btc,
      krw,
      usdt,
    },
  });

  useInitCoinList({
    initialData: {
      krw: data?.krw ?? krw,
      btc: data?.btc ?? btc,
      usdt: data?.usdt ?? usdt,
    },
    workerEnabled: false,
  });
  return null;
}

export default InitializeClient;
