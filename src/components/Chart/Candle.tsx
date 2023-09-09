import { useMemo } from 'react';
import { AxisRight } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { BoxPlot } from '@visx/stats';

type Props<T> = {
  width: number;
  height: number;
  data: T[];
};

const margin = {
  top: 20,
  bottom: 0,
  left: 20,
  right: 20,
};

const x = (d: any) => d.date;
const open = (d: any) => (d.open >= d.close ? d.open : d.close);
const close = (d: any) => (d.open < d.close ? d.open : d.close);

const Candle = ({ width, height, data }: Props<any>) => {
  const xMax = width - 40;
  const yMax = height - margin.top - margin.bottom - 100;
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        domain: data.map(({ date }) => date),
        padding: 0.3,
        round: true,
      }),
    [data, xMax],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 80],
        domain: [
          Math.min(
            ...data.map(({ close, open, low, high }) =>
              Math.min(close, open, low, high),
            ),
          ),
          Math.max(
            ...data.map(({ close, open, low, high }) =>
              Math.max(close, open, low, high),
            ),
          ),
        ],

        nice: true,
        round: true,
      }),
    [data, yMax],
  );

  return (
    <svg width={width} height={height}>
      <svg width={width - 42} height={height}>
        <Group>
          {data.map((d, idx) => (
            <g key={`box-plot-${idx}`}>
              <BoxPlot
                valueScale={yScale}
                left={xScale(x(d))}
                min={+d.low}
                max={+d.high}
                median={+close(d)}
                firstQuartile={+open(d)}
                thirdQuartile={+close(d)}
                fill={d.open > d.close ? '#1261c4' : '#c84a31'}
                stroke={d.open > d.close ? '#1261c4' : '#c84a31'}
                strokeWidth={1}
                boxWidth={xScale.bandwidth()}
              />
            </g>
          ))}
        </Group>
      </svg>
      <AxisRight scale={yScale} left={xMax} />
    </svg>
  );
};

export default Candle;
