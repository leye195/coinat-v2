'use client';

import { Suspense } from 'react';
import CoinTable from '@/components/CoinTable';
import Tab from '@/components/Tab';
import { useCoinList, useTickersData } from '@/hooks';
import { cn } from '@/lib/utils';

const HomePage = () => {
  const { krwCoinData, btcCoinData, usdtCoinData } = useCoinList();
  const { data, handleSort } = useTickersData({
    krwCoinData,
    btcCoinData,
    usdtCoinData,
  });

  return (
    <section className="pb-8 max-xl:pb-[5.25rem]">
      <div className={cn('mx-auto my-0 max-w-[768px]', 'max-md:mt-1')}>
        <Suspense>
          <Tab tabs={['KRW', 'BTC']} />
        </Suspense>
        <div
          className={cn(
            'max-md:text-xs max-sm:text-[10px]',
            'flex items-center justify-between',
          )}
        >
          <p className={cn('m-2 max-md:m-1')}>
            암호화폐 - {data?.length ?? 0}개
          </p>
        </div>
        <CoinTable coinList={data ?? []} handleSort={handleSort} />
      </div>
    </section>
  );
};

export default HomePage;
