import { ScaleLinear } from 'd3';
import { type Candle } from 'types/Candle';

type Props = {
  candle: Candle;
  width: number;
  index: number;
  scaleY: ScaleLinear<number, number>;
  scaleBody: ScaleLinear<number, number>;
};

const CandleItem = ({ candle, width, index, scaleY, scaleBody }: Props) => {
  const { open, close, high, low } = candle;
  const fill = close > open ? '#42a5f5' : '#E33F64';
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);

  return (
    <g>
      <line
        x1={x + width / 2}
        y1={scaleY(low)}
        x2={x + width / 2}
        y2={scaleY(high)}
        stroke={fill}
        strokeWidth={1}
      />
      <rect
        x={x + 2}
        y={scaleY(max)}
        width={width - 4}
        height={scaleBody(max - min)}
        fill={fill}
      />
    </g>
  );
};

export default CandleItem;
