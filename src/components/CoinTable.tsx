import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from 'ownui-system';
import { useMedia } from 'react-use';
import { useRecoilValue } from 'recoil';
import { faStar as UnLiked } from '@fortawesome/free-regular-svg-icons';
import { faStar as Liked } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MARKET_SYMBOLS, TABLE_HEADERS } from 'constant';
import Button from '@/components/Button';
import Spacing from '@/components/Spacing';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { useLocalStorage } from '@/hooks';
import { getCoinSymbolImage } from '@/lib/coin';
import { sortColumn } from '@/lib/sort';
import { cn, getBreakpointQuery, removeDuplicate, setComma } from '@/lib/utils';
import { typeState } from '@/store/coin';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import { TickerType } from '@/types/Coin';
import { CombinedTickers } from '@/store/socket';

type Props = {
  coinList: CombinedTickers[];
  handleSort: (type: string) => () => void;
};

const CoinTable = ({ coinList, handleSort }: Props) => {
  const coinType = useRecoilValue(typeState);
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  const { value: krwFavList, updateValue: updateKrwFavList } = useLocalStorage({
    key: 'krwfav',
    defaultValue: [],
  });
  const { value: btcFavList, updateValue: updateBtcFavList } = useLocalStorage({
    key: 'btcfav',
    defaultValue: [],
  });

  const isFavSymbol = useCallback(
    (symbol: string) => {
      return coinType !== 'BTC'
        ? krwFavList.includes(symbol)
        : btcFavList.includes(symbol);
    },
    [btcFavList, coinType, krwFavList],
  );

  const toggleFav = (symbol: string) => () => {
    if (isFavSymbol(symbol)) {
      handleUnFav(symbol);
      return;
    }

    handleFav(symbol);
  };

  const handleFav = (symbol: string) => {
    if (coinType !== 'BTC') {
      updateKrwFavList(removeDuplicate([...krwFavList, symbol]));
      return;
    }

    updateBtcFavList(removeDuplicate([...btcFavList, symbol]));
  };

  const handleUnFav = (symbol: string) => {
    if (coinType !== 'BTC') {
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
    return [
      ...coinList.filter(
        (data) => data.symbol !== 'BTC' && isFavSymbol(data.symbol),
      ),
      ...coinList.filter(
        (data) => data.symbol !== 'BTC' && !isFavSymbol(data.symbol),
      ),
    ];
  }, [coinList, isFavSymbol]);

  return (
    <Table
      header={
        <>
          {TABLE_HEADERS.map((name, idx) => (
            <Table.Header
              key={name}
              name={
                idx > 0 && idx < 3
                  ? `${name}(${
                      MARKET_SYMBOLS[idx === 1 ? 'upbit' : 'binance'][
                        coinType as TickerType
                      ]
                    })`
                  : name
              }
              right={
                <>
                  <Icon name="ArrowUpDown" size={14} />
                </>
              }
              width="25%"
              onClick={handleSort(sortColumn[idx])}
            />
          ))}
        </>
      }
      body={
        !filteredCointList.length ? (
          <Table.Skeleton />
        ) : (
          <>
            {filteredCointList.map((data) => (
              <Table.Row key={data.symbol}>
                <Table.Cell>
                  <div
                    className={cn('flex items-center gap-2', 'max-sm:gap-0.5')}
                  >
                    <Link
                      className={cn('flex items-center gap-1 cursor-pointer')}
                      href={`/exchange?code=${data.symbol}&type=KRW`}
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
                      <Text fontSize={isSmDown ? 14 : 16}>{data.symbol}</Text>
                    </Link>
                    <Spacing size="4px" />
                    <Button className="p-0" onClick={toggleFav(data.symbol)}>
                      <FontAwesomeIcon
                        className="text-[#e2be1b]"
                        icon={isFavSymbol(data.symbol) ? Liked : UnLiked}
                      />
                    </Button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn('flex flex-col gap-0.5')}>
                    <p className="m-0">
                      {coinType !== 'BTC'
                        ? `${setComma(data.last, 6)}₩`
                        : data.last}
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
                    <p className="m-0">{data.blast}</p>
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
                    <p className="m-0">{setComma(data?.per ?? 0)}%</p>
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
