import { AreaClosed } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisScale } from '@visx/axis';
import { curveMonotoneX } from 'd3';

type Props<T> = {
  width: number;
  height: number;
  data: T[];
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  hideAxisX?: boolean;
  hideAxisY?: boolean;
  children?: React.ReactNode;
};

const getDate = (d: any) => new Date(d?.date);
const getClose = (d: any) => d.close;

const AreaChart = ({
  width,
  height,
  data,
  xScale,
  yScale,
  children,
}: Props<any>) => {
  return (
    <svg width={width} height={height}>
      <Group>
        <AreaClosed
          data={data}
          x={(d) => xScale(getDate(d)) ?? 0}
          y={(d) => yScale(getClose(d)) ?? 0}
          yScale={yScale}
          strokeWidth={2}
          fill="#1464b091"
          curve={curveMonotoneX}
        />
        {children}
      </Group>
    </svg>
  );
};

export default AreaChart;
