'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import sort, { initSort, Sort } from '@/lib/sort';
import { useCoinStore } from '@/store/coin';
import { useCryptoSocketStore } from '@/store/socket';
import { Coin } from '@/types/Coin';

interface UseTickerDataProps {
  krwCoinData: Coin[];
  btcCoinData: Coin[];
  usdtCoinData: Coin[];
}

const INIT_SORT_TYPE = {
  symbol: false,
  last: false,
  blast: false,
  per: false,
};

const useTickerData = ({
  krwCoinData,
  btcCoinData,
  usdtCoinData,
}: UseTickerDataProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortType, setSortType] = useState(INIT_SORT_TYPE);

  const { type } = useCoinStore();
  const { combineTickers } = useCryptoSocketStore();
  const isSocketLoaded = useCryptoSocketStore(
    (state) => state.tickers !== null,
  );

  const coinData: Coin[] = useMemo(() => {
    if (type === 'KRW') {
      return krwCoinData;
    } else if (type === 'USDT') {
      return usdtCoinData;
    } else {
      return btcCoinData;
    }
  }, [type, krwCoinData, usdtCoinData, btcCoinData]);

  const getTickers = async (coinData: Coin[]) => {
    try {
      const combinedData = combineTickers(coinData, type);
      return combinedData;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (sortKey: Sort) => () => {
    setSortType((prev) => ({
      ...initSort,
      [sortKey]: !prev[sortKey],
    }));

    setSelectedType(sortKey);
  };

  const { data, ...rest } = useQuery({
    queryKey: ['coins', type, isSocketLoaded],
    queryFn: () => getTickers(coinData),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    enabled: coinData.length > 0 && isSocketLoaded,
  });

  const sortedData = useMemo(() => {
    if (!data) return undefined;
    return sort(
      data,
      selectedType ?? 'symbol',
      sortType[(selectedType ?? 'symbol') as Sort],
    );
  }, [data, selectedType, sortType]);

  return {
    data: sortedData,
    handleSort,
    ...rest,
  };
};

export default useTickerData;
