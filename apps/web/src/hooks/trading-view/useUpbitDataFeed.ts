import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  createChart,
  ColorType,
  type IChartApi,
  CandlestickSeries,
  ISeriesApi,
  LogicalRange,
  BusinessDay,
} from 'lightweight-charts';
import { format, subDays } from 'date-fns';
import { throttle } from 'es-toolkit';
import { useExchangeData } from 'hooks/queries';
import { useUpbitSeriesData } from 'hooks/queries/useUpbitCandles';
import { getUpbitCandles } from '@/api';
import { getCandleKey, getUnitKey } from '@/lib/trading-view/utils';
import { useCryptoSocketStore } from '@/store/socket';
import { palette } from '@/styles/variables';
import { TickerType } from '@/types/Coin';

interface UseUpbitDataFeed {
  code: string; // 예: "BTC", "ETH"
  unit: 'days' | 'weeks' | 'months';
  containerRef: React.RefObject<HTMLDivElement>;
  type?: TickerType;
}

const useUpbitDataFeed = ({
  code,
  unit,
  containerRef,
  type = 'KRW',
}: UseUpbitDataFeed) => {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const isFetchingRef = useRef(false);
  const priceSymbol = type === 'BTC' ? 'BTC' : 'KRW';

  const colors = useMemo(
    () => ({
      backgroundColor: 'white',
      textColor: 'black',
    }),
    [],
  );

  const seriesDataMap = useUpbitSeriesData({
    priceSymbol,
    code,
    type: unit,
  });
  const unitKey = getUnitKey(unit);
  const seriesData = useMemo(
    () => seriesDataMap.get(unitKey) ?? [],
    [seriesDataMap, unitKey],
  );

  const { btcKrw } = useCryptoSocketStore();
  const exchangeRate = btcKrw.upbit;
  const { data: wsData } = useExchangeData({
    code,
    exchange: 'upbit',
    type: priceSymbol,
    exchangeRate,
    select: ({
      openPrice: open,
      tradePrice: close,
      highPrice: high,
      lowPrice: low,
      timestamp,
    }) => {
      const date = getCandleKey(timestamp ?? 0, unitKey);

      return {
        open,
        close,
        high,
        low,
        time: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      };
    },
  });

  const fetchPreviousCandles = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const current = seriesRef.current?.data() ?? [];
      const oldest = current?.[0];

      if (
        !oldest ||
        !current ||
        current.length < 200 ||
        current.length % 200 > 1
      ) {
        return;
      }

      const getDays = () => {
        if (unit === 'days') return 1;

        if (unit === 'weeks') return 7;

        return 30;
      };

      const oldTime = oldest.time as BusinessDay;
      const dateObj = subDays(
        new Date(oldTime.year, oldTime.month - 1, oldTime.day),
        getDays(),
      );
      //const to = dateObj.toISOString(); // → "2024-06-21T00:00:00.000Z"
      const to = format(dateObj, 'yyyy-MM-dd HH:mm:ss');
      const { data } = await getUpbitCandles({
        market: `${priceSymbol}-${code}`,
        candleType: unit,
        count: 200,
        to,
      });

      const parsed = data
        .map((d) => {
          const date = new Date(d.timestamp);
          return {
            time: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
            open: d.opening_price,
            high: d.high_price,
            low: d.low_price,
            close: d.trade_price,
          };
        })
        .toReversed();

      const mergedMap = new Map();
      [...parsed, ...current].forEach((item) => {
        mergedMap.set(item.time, item);
      });
      const merged = Array.from(mergedMap.values());

      seriesRef.current?.setData(merged);
    } catch (err) {
      console.error(err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [code, priceSymbol, unit]);

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
    const newSeries = chartRef.current.addSeries(CandlestickSeries, {
      upColor: palette.red,
      downColor: palette.blue,
      wickUpColor: palette.red,
      wickDownColor: palette.blue,
      borderVisible: false,
      priceFormat: {
        type: 'price',
        precision: type === 'BTC' ? 10 : 2, // 보여줄 소수점 자릿수
        minMove: type === 'BTC' ? 0.0000000001 : 0.001, // 최소 단위
      },
    });
    newSeries.setData(seriesData); // 새로운 단위 데이터 반영

    seriesRef.current = newSeries;
    chartRef.current.timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, code, type, JSON.stringify(seriesData)]);

  useEffect(() => {
    if (!wsData || wsData?.open === 0) return;

    seriesRef.current?.update(wsData);
  }, [wsData]);

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
