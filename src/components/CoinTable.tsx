import { faStar as UnLiked } from '@fortawesome/free-regular-svg-icons';
import { faStar as Liked } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMedia } from 'react-use';
import { useRecoilValue } from 'recoil';

import Button from '@/components/Button';
import { Flex } from '@/components/Flex';
import Spacing from '@/components/Spacing';
import Table from '@/components/Table';
import { Text } from '@/components/Text';
import useLocalStorage from '@/hooks/useLocalStorage';
import { getCoinSymbolImage } from '@/lib/coin';
import { CombinedTickers } from '@/lib/socket';
import { sortColumn } from '@/lib/sort';
import { cn, getBreakpointQuery, removeDuplicate, setComma } from '@/lib/utils';
import {
  btcCoinListState,
  CoinState,
  krCoinListState,
  typeState,
} from '@/store/coin';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';

type Props = {
  krwCoinData: CoinState;
  btcCoinData: CoinState;
  coinList: CombinedTickers[];
  handleSort: (type: string) => () => void;
};

const CoinTable = ({ coinList, handleSort }: Props) => {
  const coinType = useRecoilValue(typeState);
  const { isLoading: isKrwLoading } = useRecoilValue(krCoinListState);
  const { isLoading: isBtcLoading } = useRecoilValue(btcCoinListState);

  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);
  const navigate = useRouter();

  const { value: krwFavList, updateValue: updateKrwFavList } = useLocalStorage({
    key: 'krwfav',
    defaultValue: [],
  });
  const { value: btcFavList, updateValue: updateBtcFavList } = useLocalStorage({
    key: 'btcfav',
    defaultValue: [],
  });

  const isFavSymbol = (symbol: string) => {
    if (coinType === 'KRW') return krwFavList.includes(symbol);
    return btcFavList.includes(symbol);
  };

  const toggleFav = (symbol: string) => () => {
    if (isFavSymbol(symbol)) {
      handleUnFav(symbol);
      return;
    }

    handleFav(symbol);
  };

  const handleFav = (symbol: string) => {
    if (coinType === 'KRW') {
      updateKrwFavList(removeDuplicate([...krwFavList, symbol]));
      return;
    }

    updateBtcFavList(removeDuplicate([...btcFavList, symbol]));
  };

  const handleUnFav = (symbol: string) => {
    if (coinType === 'KRW') {
      updateKrwFavList(
        krwFavList.filter((coinSymbol: string) => symbol !== coinSymbol),
      );
      return;
    }

    updateBtcFavList(
      btcFavList.filter((coinSymbol: string) => symbol !== coinSymbol),
    );
  };

  return (
    <Table
      header={
        <>
          {['코인', '업비트(₩)', '바이낸스(BTC)', '차이(%)'].map(
            (name, idx) => (
              <Table.Header
                key={name}
                name={name}
                right={
                  <Image
                    src="/assets/updown.png"
                    alt=""
                    width={6}
                    height={12}
                  />
                }
                width="25%"
                onClick={handleSort(sortColumn[idx])}
              />
            ),
          )}
        </>
      }
      body={
        !coinList.length || isKrwLoading || isBtcLoading ? (
          <Table.Skeleton />
        ) : (
          <>
            {[
              ...coinList.filter(
                (data) => data.symbol !== 'BTC' && isFavSymbol(data.symbol),
              ),
              ...coinList.filter(
                (data) => data.symbol !== 'BTC' && !isFavSymbol(data.symbol),
              ),
            ].map((data: CombinedTickers) => (
              <Table.Row key={data.symbol}>
                <Table.Cell>
                  <div
                    className={cn('flex items-center gap-2', 'max-sm:gap-0.5')}
                  >
                    <Flex
                      alignItems="center"
                      gap="4px"
                      onClick={() =>
                        navigate.push(
                          `/exchange?code=${
                            data.symbol
                          }&type=${coinType.toUpperCase()}`,
                        )
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <picture>
                        <img
                          className="rounded-[2rem]"
                          alt={data.symbol}
                          src={getCoinSymbolImage(data.symbol)}
                          width={isSmDown ? 16 : 20}
                          height={isSmDown ? 16 : 20}
                        />
                      </picture>
                      <Text fontSize={isSmDown ? 14 : 16}>{data.symbol}</Text>
                    </Flex>
                    <Spacing size="4px" />
                    <Button
                      padding={{
                        top: '0',
                        bottom: '0',
                        left: '0',
                        right: '0',
                      }}
                      onClick={toggleFav(data.symbol)}
                    >
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
                      {coinType === 'KRW'
                        ? `${setComma(data.last)}₩`
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
                      <p>{setComma(data.convertedBlast ?? 0)}₩</p>
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
