'use client';

import { useMemo, useState } from 'react';
import { Icon } from 'ownui-system';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { CombinedTickers } from '@/store/socket';
import { useWatchlistStore } from '@/store/watchlist';
import CoinTable from '../../../(main)/components/CoinTable';
import AddCoinModal from '../AddCoinModal';
import type { MarketView } from '../Page';

type Props = {
  groupId: string;
  groupName: string;
  market: MarketView;
  symbols: string[];
};

const MarketCard = ({ groupId, groupName, market, symbols }: Props) => {
  const addSymbol = useWatchlistStore((s) => s.addSymbol);
  const removeSymbol = useWatchlistStore((s) => s.removeSymbol);

  const [isAddOpen, setAddOpen] = useState(false);

  const coinList = useMemo(
    () =>
      symbols
        .map((symbol) => market.tickerMap.get(symbol))
        .filter((data): data is CombinedTickers => Boolean(data)),
    [symbols, market.tickerMap],
  );

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl overflow-hidden',
        'border border-border bg-surface',
        'shadow-sm hover:shadow-md transition-shadow',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-2',
          'px-3 py-2 border-b border-border',
        )}
      >
        <div className={cn('flex items-center gap-2')}>
          <span
            className={cn(
              'px-2 py-0.5 rounded-md text-xs font-bold',
              'bg-[#f8b64c]/15 text-[#b9791a] dark:text-[#f8b64c]',
            )}
          >
            {market.label}
          </span>
          <span className={cn('text-xs text-fg-muted')}>
            {symbols.length}종목
          </span>
        </div>
        <Button
          className={cn(
            'flex items-center gap-1 px-2 h-7 rounded-md',
            'text-xs font-medium text-fg-muted',
            'hover:bg-bg hover:text-fg transition-colors',
          )}
          aria-label={`${market.label} 종목 추가`}
          onClick={() => setAddOpen(true)}
        >
          <Icon name="Plus" size={14} />
          추가
        </Button>
      </div>

      {symbols.length === 0 ? (
        <button
          type="button"
          className={cn(
            'flex flex-col items-center justify-center gap-1.5',
            'px-4 py-8 text-center w-full',
            'text-fg-muted hover:bg-bg transition-colors',
          )}
          onClick={() => setAddOpen(true)}
        >
          <Icon name="Plus" size={18} />
          <span className={cn('text-sm')}>종목 추가</span>
        </button>
      ) : (
        <CoinTable
          bare
          marketType={market.key}
          coinList={coinList}
          onRemove={(symbol) => removeSymbol(groupId, market.key, symbol)}
          emptyMessage="표시할 시세가 없어요"
        />
      )}

      <AddCoinModal
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        groupName={`${groupName} · ${market.label}`}
        coinData={market.coinData}
        selectedSymbols={symbols}
        onToggle={(symbol, checked) =>
          checked
            ? addSymbol(groupId, market.key, symbol)
            : removeSymbol(groupId, market.key, symbol)
        }
      />
    </div>
  );
};

export default MarketCard;
