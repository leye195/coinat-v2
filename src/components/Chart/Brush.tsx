import { useEffect, useMemo, useRef } from 'react';
import { extent, max } from 'd3';
import { scaleTime, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import BaseBrush, {
  type BaseBrushState,
  type UpdateBrush,
} from '@visx/brush/lib/BaseBrush';
import { Brush } from '@visx/brush';
import { type Bounds } from '@visx/brush/lib/types';
import { type BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import AreaChart from './Area';

type Props<T> = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: T[];
  handleBrushChange: (domain: Bounds | null) => void;
};

const getDate = (d: any) => new Date(d?.date);
const getClose = (d: any) => d.close;

const BrushChart = ({
  width,
  height,
  data,
  margin = {
    top: 30,
    bottom: 30,
    left: 20,
    right: 20,
  },
  handleBrushChange,
}: Props<any>) => {
  const xMax = Math.max(width - 40, 0);
  const yMax = height;

  const brushRef = useRef<BaseBrush | null>(null);
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(data, getDate) as [Date, Date],
      }),
    [xMax, data],
  );
  const stockScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(data, getClose) || 0],
        nice: true,
      }),
    [yMax, data],
  );
  const initialPosition = useMemo(
    () => ({
      start: { x: dateScale(getDate(data[data.length - 50])) },
      end: { x: dateScale(getDate(data[data.length - 1])) },
    }),
    [data, dateScale],
  );

  useEffect(() => {
    const updater: UpdateBrush = (prevBrush) => {
      const newExtent = brushRef.current!.getExtent(
        initialPosition.start,
        initialPosition.end,
      );

      const newState: BaseBrushState = {
        ...prevBrush,
        start: { y: newExtent.y0, x: newExtent.x0 },
        end: { y: newExtent.y1, x: newExtent.x1 },
        extent: newExtent,
      };

      return newState;
    };
    brushRef?.current?.updateBrush(updater);
  }, [initialPosition]);

  return (
    <svg width={xMax} height={yMax}>
      <Group>
        <AreaChart
          width={xMax}
          height={yMax}
          xScale={dateScale}
          yScale={stockScale}
          data={data}
        >
          <Brush
            innerRef={brushRef}
            xScale={dateScale}
            yScale={stockScale}
            width={xMax}
            height={yMax}
            handleSize={8}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            margin={margin}
            initialBrushPosition={initialPosition}
            useWindowMoveEvents
            onChange={handleBrushChange}
            renderBrushHandle={(props) => <BrushHandle {...props} />}
          />
        </AreaChart>
      </Group>
    </svg>
  );
};

function BrushHandle({ x, height, isBrushActive }: BrushHandleRenderProps) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
}

export default BrushChart;
