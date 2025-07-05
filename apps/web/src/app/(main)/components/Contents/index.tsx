'use client';

import CoinTable from '@/components/CoinTable';
import { useTickersData } from '@/hooks';
import { useCoinList } from '@/hooks';
import { cn } from '@/lib/utils';
import MarketLinks from '../MarketLinks';

export default function Contents() {
  const { krwCoinData, btcCoinData, usdtCoinData } = useCoinList();
  const { data, handleSort } = useTickersData({
    krwCoinData,
    btcCoinData,
    usdtCoinData,
  });

  return (
    <>
      <div
        className={cn(
          'max-md:text-xs max-sm:text-[10px]',
          'flex items-center justify-between my-0.5',
        )}
      >
        <p className={cn('m-2 max-md:m-1')}>암호화폐 - {data?.length ?? 0}개</p>
        <MarketLinks />
      </div>
      <CoinTable coinList={data ?? []} handleSort={handleSort} />
    </>
  );
}
