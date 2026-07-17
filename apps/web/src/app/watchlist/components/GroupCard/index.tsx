'use client';

import { cn } from '@/lib/utils';
import { type WatchGroup } from '@/store/watchlist';
import MarketCard from '../MarketCard';
import type { MarketView } from '../Page';

type Props = {
  group: WatchGroup;
  markets: MarketView[];
};

const GroupCard = ({ group, markets }: Props) => {
  return (
    <div
      className={cn('grid gap-4 items-start', 'sm:grid-cols-2 xl:grid-cols-3')}
    >
      {markets.map((market) => (
        <MarketCard
          key={market.key}
          groupId={group.id}
          groupName={group.name}
          market={market}
          symbols={group.markets[market.key]}
        />
      ))}
    </div>
  );
};

export default GroupCard;
