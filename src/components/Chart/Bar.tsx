import { useMemo } from 'react';

import { AxisBottom, AxisRight } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';

type Props<T> = {
  width: number;
  height: number;
  data: T[];

  hideAxisX?: boolean;
  hideAxisY?: boolean;
  children?: React.ReactNode;
};

const margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

const x = (d: any) => d.date;
const y = (d: any) => +d.volume;

const BarChart = ({
  width,
  height,
  data,
  hideAxisX,
  hideAxisY,
  children,
}: Props<any>) => {
  const xMax = width - 40;
  const yMax = height - margin.left - margin.right;
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        domain: data.map(({ date }) => date),
        round: true,
        padding: 0.3,
      }),
    [data, xMax],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 10],
        domain: [0, Math.max(...data.map(({ volume }) => volume))],
        round: true,
        nice: true,
      }),
    [data, yMax],
  );

  return (
    <svg width={width} height={height}>
      <Group>
        {data.map((d, idx) => {
          const barHeight = yMax - (yScale(y(d)) ?? 0);
          const barWidth = xScale.bandwidth();
          const barX = xScale(x(d));
          const barY = yMax - barHeight;

          return (
            <Bar
              key={`bar-${idx}`}
              x={barX}
              y={barY}
              height={barHeight}
              width={barWidth}
              fill={d.open > d.close ? '#1261c4' : '#c84a31'}
            />
          );
        })}
        {children}
      </Group>
      {!hideAxisY && <AxisRight scale={yScale} left={xMax} top={0} />}
      {!hideAxisX && (
        <Group>
          <AxisBottom top={yMax + margin.top - 10} scale={xScale} />
        </Group>
      )}
    </svg>
  );
};

export default BarChart;
