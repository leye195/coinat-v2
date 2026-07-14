'use client';

import { useState } from 'react';
import { useDebounce } from 'react-use';
import Input from '@/components/ui/Input';
import { useTickersData } from '@/hooks';
import { useCoinList } from '@/hooks';
import { cn } from '@/lib/utils';
import CoinTable from '../CoinTable';
import MarketLinks from '../MarketLinks';

export default function Contents() {
  const { krwCoinData, btcCoinData, usdtCoinData } = useCoinList();
  const { data, handleSort, setKeyword } = useTickersData({
    krwCoinData,
    btcCoinData,
    usdtCoinData,
  });
  const [inputValue, setInputValue] = useState('');

  useDebounce(() => setKeyword(inputValue), 200, [inputValue]);

  return (
    <>
      <div className={cn('px-2 pt-2 max-md:px-1')}>
        <Input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="코인 검색 (예: BTC)"
          aria-label="코인 검색"
          className={cn(
            'w-full rounded-md px-3 py-2 text-sm',
            'bg-surface text-fg border border-border',
            'placeholder:text-fg-muted',
            'focus:outline-none focus:border-[#3772ff]',
            'max-md:text-xs',
          )}
        />
      </div>
      <div
        className={cn(
          'max-md:text-xs max-sm:text-[10px]',
          'flex items-center justify-between my-0.5',
        )}
      >
        <p className={cn('m-2 max-md:m-1')}>암호화폐 - {data?.length ?? 0}개</p>
        <MarketLinks />
      </div>
      <CoinTable
        coinList={data ?? []}
        handleSort={handleSort}
        isLoading={data === undefined}
      />
    </>
  );
}
