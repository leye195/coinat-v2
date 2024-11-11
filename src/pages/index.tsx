import { useMedia } from 'react-use';
import { useRecoilValue } from 'recoil';
import CoinTable from '@/components/CoinTable';
import Exchange from '@/components/Exchange';
import FearGreed from '@/components/FearGreed';
import Layout from '@/components/Layout';
import Tab from '@/components/Tab';
import { exchangeHeader } from '@/data/table';
import { useCoinList, useTickersData } from '@/hooks';
import { cn, getBreakpointQuery, setComma } from '@/lib/utils';
import { exchangeSelector } from '@/store/exchange';
import { breakpoints } from '@/styles/mixin';
import type { NextPageWithLayout } from '@/types/Page';

const HomePage: NextPageWithLayout = () => {
  const exchangeData = useRecoilValue(exchangeSelector);
  const { krwCoinData, btcCoinData } = useCoinList();
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);
  const { data, handleSort } = useTickersData({
    krwCoinData,
    btcCoinData,
  });

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
            title={isSmDown ? exchangeHeader[0] : `환율(${exchangeHeader[0]})`}
            value={setComma(exchangeData.usdToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdToKrw}
          />
          <Exchange
            title={isSmDown ? exchangeHeader[1] : `환율(${exchangeHeader[1]})`}
            value={setComma(exchangeData.usdtToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdtToKrw}
          />
          <Exchange
            title={exchangeHeader[2]}
            value={setComma(exchangeData.upbitBit)}
            isLoading={exchangeData.isLoading || !exchangeData.upbitBit}
          />
          <Exchange
            title={exchangeHeader[3]}
            value={setComma(exchangeData.binanceBit)}
            isLoading={exchangeData.isLoading || !exchangeData.binanceBit}
          />
          <Exchange
            title={exchangeHeader[4]}
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
