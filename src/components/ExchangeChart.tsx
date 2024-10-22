import { Chart, Nullable } from 'klinecharts';
import { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';

import useBinanceCandles from '@/hooks/useBinanceCandles';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import useUpbitCandles from '@/hooks/useUpbitCandles';
import { btcKrw } from '@/lib/socket';
import { getBreakpointQuery, reCalculateTimeStamp } from '@/lib/utils';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import type { CandleType, ChartData } from '@/types/Candle';
import type { Ticker } from '@/types/Ticker';

type ExchangeChartProps = {
  exchange: string;
  code: string;
  type: CandleType;
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
  const exchangeRate =
    priceSymbol === 'BTC' || exchange === 'upbit' ? 1 : btcKrw.upbit;

  useUpbitCandles({
    priceSymbol,
    code,
    type,
    enabled: exchange === 'upbit',
    onSuccess: (data) => {
      setIsInitialized(false);
      setChartData(data);
    },
  });

  useBinanceCandles({
    priceSymbol,
    code,
    type,
    exchangeRate,
    enabled: exchange === 'binance',
    onSuccess: (data) => {
      setIsInitialized(false);
      setChartData(data);
    },
  });

  useEffect(() => {
    import('klinecharts').then(({ init, dispose }) => {
      if (chartRef.current) dispose('chart');

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
  }, [exchange, isSmDown]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.setPriceVolumePrecision(priceSymbol === 'KRW' ? 2 : 8, 8);
    chartRef.current.resize();
  }, [isSmDown, priceSymbol]);

  useIsomorphicLayoutEffect(() => {
    if (newData && chartRef.current && isInitialized) {
      const data = {
        timestamp: reCalculateTimeStamp(
          newData.timestamp ?? new Date().getTime(),
          type,
        ),
        open: newData.openPrice * exchangeRate,
        close: newData.tradePrice * exchangeRate,
        high: newData.highPrice * exchangeRate,
        low: newData.lowPrice * exchangeRate,
        volume: newData.volume,
      };

      chartRef.current.updateData(data);
    }
  }, [newData]);

  useIsomorphicLayoutEffect(() => {
    import('klinecharts').then(() => {
      if (isInitialized) return;

      if (chartRef.current && !isInitialized) {
        setIsInitialized(true);
        chartRef.current?.applyNewData(chartData, true);
        return;
      }
    });
  }, [chartData]);

  return <div id="chart" className="w-full h-[500px] max-sm:h-[400px]"></div>;
};

export default ExchangeChart;
