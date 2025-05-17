'use client';

import Exchange from '@/components/Exchange';
import { exchangeHeader } from '@/data/table';
import { cn, setComma } from '@/lib/utils';
import { useExchangeStore } from '@/store/exchange';

function ExchangeList() {
  const exchangeData = useExchangeStore();

  return (
    <section className="max-md:overflow-auto">
      <div
        className={cn(
          'flex gap-1 my-2 mx-0',
          'max-md:w-full max-md:gap-0 max-md:my-1',
          'max-md:border max-md:border-[#d0d0d0] max-md:bg-white',
          'max-sm:hidden max-sm:py-0 max-sm:px-1',
        )}
      >
        <Exchange
          title={`환율(${exchangeHeader[0]})`}
          value={setComma(exchangeData.usdToKrw)}
          isLoading={exchangeData.isLoading || !exchangeData.usdToKrw}
        />
        <Exchange
          title={`환율(${exchangeHeader[1]})`}
          value={setComma(exchangeData.usdtToKrw)}
          isLoading={exchangeData.isLoading || !exchangeData.usdtToKrw}
        />
        <Exchange
          title={exchangeHeader[2]}
          value={setComma(exchangeData.upbitBTC)}
          isLoading={exchangeData.isLoading || !exchangeData.upbitBTC}
        />
        <Exchange
          title={exchangeHeader[3]}
          value={setComma(exchangeData.binanceBTC)}
          isLoading={exchangeData.isLoading || !exchangeData.binanceBTC}
        />
        <Exchange
          title={exchangeHeader[4]}
          value={`${setComma(exchangeData.bitDiff)}%`}
          isLoading={exchangeData.isLoading || !exchangeData.bitDiff}
        />
      </div>
      <div
        className={cn(
          'hidden gap-1 my-2 mx-0',
          'max-md:w-full max-md:gap-0 max-md:my-1',
          'max-md:border max-md:border-[#d0d0d0] max-md:bg-white',
          'max-sm:flex max-sm:py-0 max-sm:px-1',
        )}
      >
        <Exchange
          title={exchangeHeader[0]}
          value={setComma(exchangeData.usdToKrw)}
          isLoading={exchangeData.isLoading || !exchangeData.usdToKrw}
        />
        <Exchange
          title={exchangeHeader[1]}
          value={setComma(exchangeData.usdtToKrw)}
          isLoading={exchangeData.isLoading || !exchangeData.usdtToKrw}
        />
        <Exchange
          title={exchangeHeader[2]}
          value={setComma(exchangeData.upbitBTC)}
          isLoading={exchangeData.isLoading || !exchangeData.upbitBTC}
        />
        <Exchange
          title={exchangeHeader[3]}
          value={setComma(exchangeData.binanceBTC)}
          isLoading={exchangeData.isLoading || !exchangeData.binanceBTC}
        />
        <Exchange
          title={exchangeHeader[4]}
          value={`${setComma(exchangeData.bitDiff)}%`}
          isLoading={exchangeData.isLoading || !exchangeData.bitDiff}
        />
      </div>
    </section>
  );
}

export default ExchangeList;
