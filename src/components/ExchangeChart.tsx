'use client';

import { useMemo, useRef, useState } from 'react';
import { Chart, init, dispose, Nullable } from 'klinecharts';
import { useMounted } from 'ownui-system';
import { useMedia } from 'react-use';
import { useRecoilValue } from 'recoil';
import {
  useBinanceCandles,
  useUpbitCandles,
  useIsomorphicLayoutEffect,
} from '@/hooks';
import { getBreakpointQuery, reCalculateTimeStamp } from '@/lib/utils';
import { cryptoSocketState } from '@/store/socket';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import type { CandleType } from '@/types/Candle';
import type { Ticker } from '@/types/Ticker';

type ExchangeChartProps = {
  exchange: string;
  code: string;
  type: CandleType;
  interval: string;
  priceSymbol: string;
  newData: Extract<Ticker[keyof Ticker], object>;
};

const ExchangeChart = ({
  code,
  type,
  newData,
  priceSymbol,
  exchange,
  interval,
}: ExchangeChartProps) => {
  const chartRef = useRef<Nullable<Chart>>();

  const isMounted = useMounted();
  const [isInitialized, setIsInitialized] = useState(false);
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);
  const { btcKrw } = useRecoilValue(cryptoSocketState);

  const exchangeRate =
    priceSymbol === 'BTC' || exchange === 'upbit' ? 1 : btcKrw.upbit;

  const { data: upbitData } = useUpbitCandles({
    priceSymbol,
    code,
    type,
    interval,
    enabled: exchange === 'upbit',
  });

  const { data: binanceData } = useBinanceCandles({
    priceSymbol,
    code,
    type,
    exchangeRate,
    interval,
    enabled: exchange === 'binance',
  });

  const chartData = useMemo(() => {
    return exchange === 'upbit' ? upbitData : binanceData;
  }, [upbitData, binanceData, exchange]);
  useIsomorphicLayoutEffect(() => {
    setIsInitialized(false);
  }, [exchange, interval]);

  useIsomorphicLayoutEffect(() => {
    const chartStyle = {
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
    };

    if (!isMounted || isInitialized) return;

    if (chartRef.current) {
      dispose('chart');
    }

    chartRef.current = init('chart', chartStyle);
    chartRef.current?.applyNewData(chartData, true);

    const currentDataLength = chartRef.current?.getDataList().length;

    setIsInitialized(!!currentDataLength);
  }, [isSmDown, isMounted, upbitData, binanceData, exchange]);

  useIsomorphicLayoutEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.setPriceVolumePrecision(priceSymbol === 'KRW' ? 2 : 8, 8);
    chartRef.current.resize();
  }, [isSmDown, priceSymbol]);

  useIsomorphicLayoutEffect(() => {
    if (newData && chartRef.current && isInitialized && chartData) {
      const lastData = chartData[chartData.length - 1];
      const isDaily = interval === 'daily';

      const data = {
        timestamp: isDaily
          ? reCalculateTimeStamp(
              newData.timestamp ?? new Date().getTime(),
              type,
            )
          : lastData.timestamp,
        open: isDaily ? newData.openPrice * exchangeRate : lastData.open,
        close: newData.tradePrice * exchangeRate,
        high: isDaily ? newData.highPrice * exchangeRate : lastData.high,
        low: isDaily ? newData.lowPrice * exchangeRate : lastData.low,
        volume: newData.volume,
      };

      chartRef.current.updateData(data);
    }
  }, [newData, isInitialized, interval, exchange, chartData]);

  return <div id="chart" className="h-[500px] w-full max-sm:h-[400px]"></div>;
};

export default ExchangeChart;
