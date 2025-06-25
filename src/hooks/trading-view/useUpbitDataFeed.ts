import { useCallback, useEffect, useMemo, useRef } from 'react';
import { format, parse, subDays } from 'date-fns';
import { throttle } from 'es-toolkit';
import {
  createChart,
  ColorType,
  type IChartApi,
  CandlestickSeries,
  ISeriesApi,
  LogicalRange,
} from 'lightweight-charts';
import { useExchangeData } from 'hooks/queries';
import { useUpbitSeriesData } from 'hooks/queries/useUpbitCandles';
import { getUpbitCandles } from '@/api';
import { getCandleKey, getUnitKey } from '@/lib/trading-view/utils';
import { useCryptoSocketStore } from '@/store/socket';

interface UseUpbitDataFeed {
  code: string; // 예: "BTC", "ETH"
  unit: 'days' | 'weeks' | 'months';
  containerRef: React.RefObject<HTMLDivElement>;
}

const useUpbitDataFeed = ({ code, unit, containerRef }: UseUpbitDataFeed) => {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const isFetchingRef = useRef(false);

  // ✅ 차트 색상 설정
  const colors = useMemo(
    () => ({
      backgroundColor: 'white',
      lineColor: '#2962FF',
      textColor: 'black',
      areaTopColor: '#2962FF',
      areaBottomColor: 'rgba(41, 98, 255, 0.28)',
    }),
    [],
  );

  const seriesDataMap = useUpbitSeriesData({ priceSymbol: 'KRW', code });
  const unitKey = getUnitKey(unit);
  const seriesData = useMemo(
    () => seriesDataMap.get(unitKey) ?? [],
    [seriesDataMap, unitKey],
  );

  //console.log(seriesData);

  const { btcKrw } = useCryptoSocketStore();
  const exchangeRate = btcKrw.upbit;
  const { data: wsData } = useExchangeData({
    code,
    exchange: 'upbit',
    type: 'KRW',
    exchangeRate,
    select: ({
      openPrice: open,
      tradePrice: close,
      highPrice: high,
      lowPrice: low,
      timestamp,
    }) => {
      const time = format(getCandleKey(timestamp ?? 0, unitKey), 'yyyy-MM-dd');

      return {
        open,
        close,
        high,
        low,
        time,
      };
    },
  });

  const fetchPreviousCandles = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const current = seriesRef.current?.data();
      const oldest = current?.[0];

      if (!oldest || !current || current.length % 200 > 1) return;

      const getDays = () => {
        if (unit === 'days') return 1;

        if (unit === 'weeks') return 7;

        return 30;
      };

      const dateObj = subDays(
        parse(oldest.time as string, 'yyyy-MM-dd', new Date()),
        getDays(),
      );

      //const to = dateObj.toISOString(); // → "2024-06-21T00:00:00.000Z"
      const to = format(dateObj, 'yyyy-MM-dd HH:mm:ss');
      //console.log(dateObj.toString(), oldest.time);
      console.log(to);

      const { data } = await getUpbitCandles({
        market: `KRW-${code}`,
        candleType: unit,
        count: 200,
        to,
      });

      const parsed = data
        .map((d) => ({
          time: format(d.timestamp, 'yyyy-MM-dd'),
          open: d.opening_price,
          high: d.high_price,
          low: d.low_price,
          close: d.trade_price,
        }))
        .toReversed();

      const merged = [...parsed, ...current];

      console.log(merged);

      seriesRef.current?.setData(merged);
    } finally {
      isFetchingRef.current = false;
    }
  }, [code, unit]);

  const throttledFetch = useMemo(() => {
    return throttle(() => {
      fetchPreviousCandles();
    }, 1000);
  }, [fetchPreviousCandles]);

  useEffect(() => {
    if (!containerRef.current) return;

    // ✅ 차트 생성
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      width: containerRef.current.clientWidth,
      height: 300,
    });
    chartRef.current = chart;

    // ✅ 리사이즈 대응
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [containerRef, colors]);

  // ✅ 단위가 바뀌었을 때 데이터 교체
  useEffect(() => {
    if (!chartRef.current) return;

    // 기존 시리즈 제거
    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    // 새 시리즈 생성

    const newSeries = chartRef.current.addSeries(CandlestickSeries);
    newSeries.setData(seriesData); // 새로운 단위 데이터 반영

    seriesRef.current = newSeries;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, JSON.stringify(seriesData)]);

  useEffect(() => {
    if (!wsData || wsData?.open === 0) return;

    seriesRef.current?.update(wsData);
  }, [wsData]);

  // todo: infinite history
  useEffect(() => {
    if (!chartRef.current) return;

    const handleRangeChange = (range: LogicalRange | null) => {
      if (!range) return;

      if (range.from < 30) {
        throttledFetch(); // 👈 여기서 호출
      }
    };

    const timeScale = chartRef.current.timeScale();
    timeScale.fitContent();
    timeScale.subscribeVisibleLogicalRangeChange(handleRangeChange);

    return () => {
      timeScale.unsubscribeVisibleLogicalRangeChange(handleRangeChange);
      throttledFetch.cancel?.();
    };
  }, [throttledFetch]);

  return {
    chart: chartRef.current,
  };
};

export default useUpbitDataFeed;
