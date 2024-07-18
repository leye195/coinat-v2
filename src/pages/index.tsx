import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useMedia } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getCurrencyInfo } from '@/api';
import CoinTable from '@/components/CoinTable';
import Exchange from '@/components/Exchange';
import FearGreed from '@/components/FearGreed';
import Layout from '@/components/Layout';
import Tab from '@/components/Tab';

import useCoinList from '@/hooks/useCoinList';
import { combineTickers } from '@/lib/socket';
import sort, { initSort, Sort } from '@/lib/sort';
import { cn, getBreakpointQuery, setComma } from '@/lib/utils';
import { typeState } from '@/store/coin';
import { exchangeSelector, exchangeState } from '@/store/exchange';
import { breakpoints } from '@/styles/mixin';
import type { NextPageWithLayout } from '@/types/Page';

const HomePage: NextPageWithLayout = () => {
  const selectedType = useRef<string | null>(null);
  const sortType = useRef({
    symbol: false,
    last: false,
    blast: false,
    per: false,
  });

  const coinType = useRecoilValue(typeState);
  const exchangeData = useRecoilValue(exchangeSelector);
  const setExchangeState = useSetRecoilState(exchangeState);

  const { krwCoinData, btcCoinData } = useCoinList();
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  const { data } = useQuery({
    queryKey: ['coins', coinType, krwCoinData.data, btcCoinData.data],
    queryFn: () => getTickers(),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const getTickers = async () => {
    try {
      const data = combineTickers(
        coinType === 'KRW' ? krwCoinData.data : btcCoinData.data,
        coinType,
      );

      const { data: currencyData } = await getCurrencyInfo();

      const btc = data.find((data) => data.symbol === 'BTC');
      const upbitBit = btc?.last ?? 0;
      const binanceBit = btc?.blast ?? 0;

      setExchangeState({
        upbitBit,
        binanceBit,
        usdToKrw: currencyData.value,
        isLoading: false,
      });

      const result = sort(
        data,
        selectedType.current ?? 'symbol',
        sortType.current[selectedType.current as Sort],
      );
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (type: string) => () => {
    sortType.current = {
      ...initSort,
      [type]: !sortType.current[type as Sort],
    };

    selectedType.current = type;
  };

  return (
    <div className="font-bold">
      <FearGreed />
      <section className="max-md:overflow-auto">
        <div
          className={cn(
            'flex gap-1 my-2 mx-0',
            'max-md:w-full max-md:gap-0 max-md:my-1',
            'max-md:border max-md:border-[#d0d0d0] max-md:bg-white',
            'max-sm:py-0 max-sm:px-1',
          )}
        >
          <Exchange
            title={isSmDown ? 'USD/KRW' : '환율(USD/KRW)'}
            value={setComma(exchangeData.usdToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdToKrw}
          />
          <Exchange
            title={isSmDown ? 'USDT/KRW' : '환율(USDT/KRW)'}
            value={setComma(exchangeData.usdtToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdtToKrw}
          />
          <Exchange
            title="업비트(BTC)"
            value={setComma(exchangeData.upbitBit)}
            isLoading={exchangeData.isLoading || !exchangeData.upbitBit}
          />
          <Exchange
            title="바이낸스(BTC)"
            value={setComma(exchangeData.binanceBit)}
            isLoading={exchangeData.isLoading || !exchangeData.binanceBit}
          />
          <Exchange
            title="BTC 차이(%)"
            value={`${setComma(exchangeData.bitDiff)}%`}
            isLoading={exchangeData.isLoading || !exchangeData.bitDiff}
          />
        </div>
      </section>
      <section className="pb-8 max-xl:pb-[5.25rem]">
        <div className={cn('mx-auto my-0 max-w-[768px]', 'max-md:mt-1')}>
          <Tab tabs={['KRW', 'BTC']} />
          <div className={cn('max-md:text-xs max-sm:text-[10px]')}>
            <p className={cn('m-2 max-md:m-1')}>암호화폐 - {data?.length}개</p>
          </div>
          <CoinTable
            krwCoinData={krwCoinData}
            btcCoinData={btcCoinData}
            coinList={data ?? []}
            handleSort={handleSort}
          />
        </div>
      </section>
    </div>
  );
};

HomePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default HomePage;
