import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import { Chart, Nullable } from 'klinecharts';
import { useQuery } from 'react-query';
import { getUpbitCandles } from 'api';
import { CandleType, ChartData } from 'types/Candle';
import { Ticker } from 'types/Ticker';
import { getBreakpointQuery, reCalculateTimeStamp } from '@/lib/utils';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import { Flex } from './Flex';

type ExchangeChartProps = {
  code: string;
  type: string;
  newData: Extract<Ticker[keyof Ticker], object>;
};

const ExchangeChart = ({ code, type, newData }: ExchangeChartProps) => {
  const chartRef = useRef<Nullable<Chart>>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  useQuery({
    queryKey: ['exchange', code, type],
    queryFn: ({ queryKey }) =>
      getUpbitCandles({
        market: queryKey[1],
        candleType: queryKey[2] as CandleType,
        count: 200,
      }),
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
  });

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current?.setStyles({
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
    });
    chartRef.current?.resize();
  }, [isSmDown]);

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

      chartRef.current = init('chart');
    });
  }, [chartData]);

  return <Container id="chart"></Container>;
};

const Container = styled(Flex)`
  width: 100%;
  height: 500px;

  ${breakpoints.down('sm')} {
    height: 400px;
  }
`;

export default ExchangeChart;