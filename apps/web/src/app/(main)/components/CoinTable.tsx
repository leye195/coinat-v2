import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { Icon } from 'ownui-system';
import { useMedia } from 'react-use';
import { faStar as UnLiked } from '@fortawesome/free-regular-svg-icons';
import { faStar as Liked } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/ui/Button';
import Spacing from '@/components/ui/Spacing';
import Table from '@/components/ui/Table';
import Text from '@/components/ui/Text';
import { MARKET_SYMBOLS, TABLE_HEADERS } from '@/constant';
import { useLocalStorage } from '@/hooks';
import { getCoinSymbolImage } from '@/lib/coin';
import { Sort, sortColumn } from '@/lib/sort';
import { cn, getBreakpointQuery, removeDuplicate, setComma } from '@/lib/utils';
import { useCoinStore } from '@/store/coin';
import { CombinedTickers } from '@/store/socket';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import { TickerType } from '@/types/Coin';

type Props = {
  coinList: CombinedTickers[];
  handleSort?: (type: Sort) => () => void;
  isLoading?: boolean;
  // When provided, the leading star toggle is replaced with a remove (x) button
  // and the favorite-sorting is skipped — used by the watchlist group cards,
  // where rows come pre-scoped to a group and are removed, not favorited.
  onRemove?: (symbol: string) => void;
  emptyMessage?: string;
  // Pin the table to a specific market instead of the global coin-store type
  // (the watchlist shows KRW/BTC/USDT cards side by side, each with its own).
  marketType?: TickerType;
  // Drop the outer border so it can render inside another bordered card.
  bare?: boolean;
};

const CoinTable = ({
  coinList,
  handleSort,
  isLoading = false,
  onRemove,
  emptyMessage = '검색 결과가 없습니다.',
  marketType,
  bare = false,
}: Props) => {
  const { type: storeType } = useCoinStore();
  const type = marketType ?? storeType;
  const isRemoveVariant = !!onRemove;
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  const { value: krwFavList, updateValue: updateKrwFavList } = useLocalStorage<
    string[]
  >('krwfav', []);
  const { value: btcFavList, updateValue: updateBtcFavList } = useLocalStorage<
    string[]
  >('btcfav', []);

  const isFavSymbol = useCallback(
    (symbol: string) => {
      return type !== 'BTC'
        ? krwFavList.includes(symbol)
        : btcFavList.includes(symbol);
    },
    [btcFavList, type, krwFavList],
  );

  const toggleFav = (symbol: string) => () => {
    if (isFavSymbol(symbol)) {
      handleUnFav(symbol);
      return;
    }

    handleFav(symbol);
  };

  const handleFav = (symbol: string) => {
    if (type !== 'BTC') {
      updateKrwFavList(removeDuplicate([...krwFavList, symbol]));
      return;
    }

    updateBtcFavList(removeDuplicate([...btcFavList, symbol]));
  };

  const handleUnFav = (symbol: string) => {
    if (type !== 'BTC') {
      updateKrwFavList(
        krwFavList.filter((coinSymbol: string) => symbol !== coinSymbol),
      );
      return;
    }

    updateBtcFavList(
      btcFavList.filter((coinSymbol: string) => symbol !== coinSymbol),
    );
  };

  const filteredCointList = useMemo(() => {
    if (isRemoveVariant) {
      // Watchlist group card: keep the caller-provided order as-is.
      return coinList.filter((data) => data.symbol !== 'BTC');
    }

    return [
      ...coinList.filter(
        (data) => data.symbol !== 'BTC' && isFavSymbol(data.symbol),
      ),
      ...coinList.filter(
        (data) => data.symbol !== 'BTC' && !isFavSymbol(data.symbol),
      ),
    ];
  }, [coinList, isFavSymbol, isRemoveVariant]);

  return (
    <Table
      bare={bare}
      header={
        <>
          {TABLE_HEADERS.map((name, idx) => (
            <Table.Header
              key={name}
              name={
                // The watchlist card already shows the market as a badge, so
                // drop the redundant (₩/BTC/USDT) suffix there to save space.
                idx > 0 && idx < 3 && !isRemoveVariant
                  ? `${name}(${
                      MARKET_SYMBOLS[idx === 1 ? 'upbit' : 'binance'][
                        type as TickerType
                      ]
                    })`
                  : name
              }
              right={
                isRemoveVariant ? undefined : (
                  <Icon name="ArrowUpDown" size={14} />
                )
              }
              width="25%"
              onClick={handleSort ? handleSort(sortColumn[idx]) : undefined}
            />
          ))}
        </>
      }
      body={
        !filteredCointList.length ? (
          isLoading ? (
            <Table.Skeleton />
          ) : (
            <div
              className={cn(
                'w-full bg-surface py-10',
                'text-center text-sm text-fg-muted',
              )}
            >
              {emptyMessage}
            </div>
          )
        ) : (
          <>
            {filteredCointList.map((data) => (
              <Table.Row
                key={data.symbol}
                className={cn(
                  isRemoveVariant &&
                    'py-1.5 border-b border-border/70 last:border-b-0 hover:bg-bg transition-colors',
                )}
              >
                <Table.Cell>
                  <div
                    className={cn('flex items-center gap-2', 'max-sm:gap-0.5')}
                  >
                    {isRemoveVariant ? (
                      <Button
                        className={cn(
                          'p-0 bg-transparent text-fg-muted transition-colors',
                          'hover:text-[#ef5350]',
                        )}
                        aria-label={`${data.symbol} 관심목록에서 제거`}
                        onClick={() => onRemove?.(data.symbol)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Button>
                    ) : (
                      <Button className="p-0" onClick={toggleFav(data.symbol)}>
                        <FontAwesomeIcon
                          className="text-[#e2be1b]"
                          icon={isFavSymbol(data.symbol) ? Liked : UnLiked}
                        />
                      </Button>
                    )}
                    <Spacing size="4px" />
                    <Link
                      className={cn('flex items-center gap-1 cursor-pointer')}
                      href={`/trading-view?code=${data.symbol}&type=${type}`}
                    >
                      <picture>
                        <img
                          className="w-5 min-w-4 rounded-[2rem] max-sm:w-4"
                          alt={data.symbol}
                          src={getCoinSymbolImage(data.symbol)}
                          width={20}
                          height={20}
                        />
                      </picture>
                      <Text
                        fontSize={isRemoveVariant ? 13 : isSmDown ? 14 : 16}
                        fontWeight={isRemoveVariant ? 600 : undefined}
                      >
                        {data.symbol}
                      </Text>
                    </Link>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn('flex flex-col gap-0.5')}>
                    <p className="m-0">
                      {type !== 'BTC'
                        ? `${setComma(data.last, 6)}₩`
                        : data.last.toFixed(8)}
                    </p>
                    {data.upbitWarning && (
                      <div
                        className={cn(
                          'text-white bg-orange-300',
                          'p-0.5 text-sm font-semibold',
                          'max-md:text-[10px]',
                        )}
                      >
                        투자 유의
                      </div>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn('flex flex-col')}>
                    <p className="m-0">{data.blast.toFixed(8)}</p>
                    {data.convertedBlast && (
                      <p>{setComma(data.convertedBlast ?? 0, 6)}₩</p>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell
                  color={
                    data.per
                      ? data.per > 0
                        ? palette.red
                        : palette.blue
                      : palette.black
                  }
                >
                  <div className={cn('flex flex-col')}>
                    <p
                      className={cn('m-0', isRemoveVariant && 'font-semibold')}
                    >
                      {isRemoveVariant && (data?.per ?? 0) > 0 ? '+' : ''}
                      {setComma(data?.per ?? 0)}%
                    </p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </>
        )
      }
    />
  );
};

export default CoinTable;
