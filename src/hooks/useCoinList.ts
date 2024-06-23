import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import useMount from '@/hooks/useMount';
import { getCoins } from '@/lib/coin';
import { initSocket } from '@/lib/socket';
import { btcCoinListState, krCoinListState } from 'store/coin';

const useCoinList = () => {
  const isMounted = useMount();
  const [krwCoinData, setKrwCoinList] = useRecoilState(krCoinListState);
  const [btcCoinData, setBtcCoinList] = useRecoilState(btcCoinListState);

  const fetchCoins = (type: 'KRW' | 'BTC') => async () => {
    try {
      const data = await getCoins(type);
      return data ?? [];
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isMounted) {
      (async () => {
        const [krwCoins, btcCoins] = await Promise.allSettled([
          fetchCoins('KRW')(),
          fetchCoins('BTC')(),
        ]);

        if (krwCoins.status === 'fulfilled' && krwCoins.value) {
          setKrwCoinList({
            isLoading: false,
            data: krwCoins.value,
          });
        }

        if (btcCoins.status === 'fulfilled' && btcCoins.value) {
          setBtcCoinList({ isLoading: false, data: btcCoins.value });
        }

        if (
          krwCoins.status === 'fulfilled' &&
          krwCoins.value &&
          btcCoins.status === 'fulfilled' &&
          btcCoins.value
        )
          initSocket([...krwCoins.value, ...btcCoins.value]);
      })();
    }
  }, [isMounted, setBtcCoinList, setKrwCoinList]);

  return { krwCoinData, btcCoinData };
};

export default useCoinList;
