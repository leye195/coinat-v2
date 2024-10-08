import { Chart, Nullable } from 'klinecharts';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useMedia } from 'react-use';

import { getBinanceCandles, getUpbitCandles } from '@/api';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import useMount from '@/hooks/useMount';
import { btcKrw } from '@/lib/socket';
import { getBreakpointQuery, reCalculateTimeStamp } from '@/lib/utils';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import type { CandleType, ChartData } from '@/types/Candle';
import type { Ticker } from '@/types/Ticker';

type ExchangeChartProps = {
  exchange: string;
  code: string;
  type: string;
  priceSymbol: string;
  newData: Extract<Ticker[keyof Ticker], object>;
};

const ExchangeChart = ({
  code,
  type,
  newData,
  priceSymbol,
  exchange,
}: ExchangeChartProps) => {
  const chartRef = useRef<Nullable<Chart>>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);
  const isMounted = useMount();

  useQuery({
    queryKey: ['exchange', `${priceSymbol}-${code}`, type, 'upbit'],
    queryFn: ({ queryKey }) =>
      getUpbitCandles({
        market: queryKey[1],
        candleType: queryKey[2] as CandleType,
        count: 200,
      }),
    enabled: exchange === 'upbit',
    select: ({ data }) => {
      const parsedData = data.map((item) => ({
        close: item.trade_price,
        high: item.high_price,
        low: item.low_price,
        open: item.opening_price,
        timestamp: reCalculateTimeStamp(item.timestamp),
        volume: item.candle_acc_trade_volume,
      }));

      return parsedData.reverse();
    },
    onSuccess: (data) => {
      setIsInitialized(false);
      setChartData(data);
    },
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ['exchange', `${code}BTC`, type, 'binance'],
    queryFn: ({ queryKey }) =>
      getBinanceCandles({
        symbol: queryKey[1],
        interval: queryKey[2] as CandleType,
      }),
    enabled: exchange === 'binance',
    select: ({ data }) => {
      const exchangeRate = priceSymbol === 'BTC' ? 1 : btcKrw.upbit;
      const parsedData = data.map((item: Array<string | number>) => ({
        close: +item[4] * exchangeRate,
        high: +item[2] * exchangeRate,
        low: +item[3] * exchangeRate,
        open: +item[1] * exchangeRate,
        timestamp: item[0], //reCalculateTimeStamp(item.timestamp),
        volume: +item[5],
      }));

      return parsedData;
    },
    onSuccess: (data) => {
      setIsInitialized(false);
      setChartData(data);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!chartRef.current || !isMounted || !isInitialized) return;

    chartRef.current?.setPriceVolumePrecision(priceSymbol === 'KRW' ? 2 : 8, 8);
    chartRef.current?.resize();
  }, [isSmDown, priceSymbol, isMounted, isInitialized, exchange]);

  useIsomorphicLayoutEffect(() => {
    if (newData && chartRef.current && isInitialized) {
      const data = {
        timestamp: reCalculateTimeStamp(newData?.timestamp ?? 0),
        open: newData.openPrice,
        close: newData.tradePrice,
        high: newData.highPrice,
        low: newData.lowPrice,
        volume: newData.volume,
      };

      chartRef.current?.updateData(data);
      setChartData((prev) => [data, ...prev]);
    }
  }, [newData]);

  useIsomorphicLayoutEffect(() => {
    import('klinecharts').then(({ init }) => {
      if (isInitialized) return;

      if (chartRef.current) {
        setIsInitialized(true);
        chartRef.current?.applyNewData(chartData);
        return;
      }

      chartRef.current = init('chart', {
        styles: {
          candle: {
            tooltip: {
              text: {
                size: isSmDown ? 10 : 12,
              },
            },
            priceMark: {
              last: {
                text: {
                  size: isSmDown ? 10 : 12,
                },
                upColor: palette.red,
                downColor: palette.blue,
              },
            },
            bar: {
              upColor: palette.red,
              downColor: palette.blue,
              upBorderColor: palette.red,
              downBorderColor: palette.blue,
              upWickColor: palette.red,
              downWickColor: palette.blue,
            },
          },
          xAxis: {
            tickText: {
              size: isSmDown ? 10 : 12,
            },
          },
          yAxis: {
            tickText: {
              size: isSmDown ? 10 : 12,
            },
          },
        },
      });
    });
  }, [chartData]);

  return <div id="chart" className="w-full h-[500px] max-sm:h-[400px]"></div>;
};

export default ExchangeChart;
