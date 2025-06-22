import { useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import {
  createChart,
  ColorType,
  type IChartApi,
  CandlestickSeries,
  ISeriesApi,
} from 'lightweight-charts';
import { useExchangeData } from 'hooks/queries';
import { useUpbitSeriesData } from 'hooks/queries/useUpbitCandles';
import { useCryptoSocketStore } from '@/store/socket';
import { getCandleKey, getUnitKey } from '@/lib/trading-view/utils';

interface UseUpbitDataFeed {
  code: string; // 예: "BTC"
  unit: 'days' | 'weeks' | 'months';
  containerRef: React.RefObject<HTMLDivElement>;
}

const useUpbitDataFeed = ({ code, unit, containerRef }: UseUpbitDataFeed) => {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

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
  }, [containerRef]);

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
  }, [unit, seriesData]);

  useEffect(() => {
    if (!wsData || wsData?.open === 0) return;

    seriesRef.current?.update(wsData);
  }, [wsData]);

  return {
    chart: chartRef.current,
  };
};

export default useUpbitDataFeed;
