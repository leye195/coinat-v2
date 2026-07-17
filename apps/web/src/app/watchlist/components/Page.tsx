'use client';

import { useEffect, useMemo } from 'react';
import { useMounted } from 'ownui-system';
import { useCoinList } from '@/hooks';
import { getLocalStorageData } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { CombinedTickers, useCryptoSocketStore } from '@/store/socket';
import { useWatchlistStore } from '@/store/watchlist';
import { Coin, TickerType } from '@/types/Coin';
import GroupCard from './GroupCard';

export type MarketView = {
  key: TickerType;
  label: string;
  tickerMap: Map<string, CombinedTickers>;
  // The market's full coin universe (for the "add coin" picker).
  coinData: Coin[];
};

const toMap = (list: CombinedTickers[]) => {
  const map = new Map<string, CombinedTickers>();
  list.forEach((ticker) => map.set(ticker.symbol, ticker));
  return map;
};

const WatchlistPage = () => {
  const mounted = useMounted();
  const { krwCoinData, btcCoinData, usdtCoinData } = useCoinList();

  const combineTickers = useCryptoSocketStore((s) => s.combineTickers);
  // Subscribe to the live snapshot so the derived maps recompute on each tick.
  const tickers = useCryptoSocketStore((s) => s.tickers);

  const groups = useWatchlistStore((s) => s.groups);
  const seeded = useWatchlistStore((s) => s.seeded);
  const seedFromLegacy = useWatchlistStore((s) => s.seedFromLegacy);

  // One-time, non-destructive migration of the legacy per-market favorites
  // into the default group, keeping each market's list separate.
  useEffect(() => {
    if (seeded) return;
    const krwFav: string[] = getLocalStorageData('krwfav') ?? [];
    const btcFav: string[] = getLocalStorageData('btcfav') ?? [];
    seedFromLegacy({ KRW: krwFav, BTC: btcFav });
  }, [seeded, seedFromLegacy]);

  // Only the coins actually watched (across all groups) per market — combining
  // tickers over the full universe every socket tick would be wasteful.
  const watchedByMarket = useMemo(() => {
    const pick = (market: TickerType, universe: Coin[]) => {
      const watched = new Set(groups.flatMap((g) => g.markets?.[market] || []));
      return (universe || []).filter((coin) => watched.has(coin.name));
    };
    return {
      KRW: pick('KRW', krwCoinData),
      BTC: pick('BTC', btcCoinData),
      USDT: pick('USDT', usdtCoinData),
    };
  }, [groups, krwCoinData, btcCoinData, usdtCoinData]);

  const markets = useMemo<MarketView[]>(
    () => [
      {
        key: 'KRW',
        label: 'KRW',
        tickerMap: toMap(combineTickers(watchedByMarket.KRW, 'KRW')),
        coinData: krwCoinData || [],
      },
      {
        key: 'USDT',
        label: 'USDT',
        tickerMap: toMap(combineTickers(watchedByMarket.USDT, 'USDT')),
        coinData: usdtCoinData || [],
      },
      {
        key: 'BTC',
        label: 'BTC',
        tickerMap: toMap(combineTickers(watchedByMarket.BTC, 'BTC')),
        coinData: btcCoinData || [],
      },
    ],
    // `tickers` drives the live update; combineTickers reads the latest snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      combineTickers,
      krwCoinData,
      btcCoinData,
      usdtCoinData,
      watchedByMarket,
      tickers,
    ],
  );

  return (
    <section className="pb-8 max-xl:pb-[5.25rem]">
      <div className={cn('w-full', 'max-md:mt-1')}>
        <div className={cn('mt-4 mb-4')}>
          <h1 className={cn('m-0 text-2xl font-bold max-md:text-xl')}>
            관심종목
          </h1>
          <p className={cn('m-0 mt-1 text-sm text-fg-muted')}>
            마켓(KRW·USDT·BTC)별 시세를 한 화면에서 확인하세요.
          </p>
        </div>

        {!mounted ? (
          <div className={cn('py-16 text-center text-sm text-fg-muted')}>
            불러오는 중...
          </div>
        ) : (
          <div className={cn('flex flex-col gap-6')}>
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} markets={markets} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WatchlistPage;
