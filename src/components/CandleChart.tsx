import * as d3 from 'd3';

import { Candle as CandleType } from 'types/Candle';
import Candle from './Candle';

type Props = {
  width: number;
  height: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  candles: CandleType[];
};

const Chart = ({ width, height, candles }: Props) => {
  const highLow = candles.map(({ high, low }) => [high, low]).flat();
  const domain = [Math.min(...highLow), Math.max(...highLow)];
  const scaleY = d3
    .scaleLinear()
    .domain(domain)
    .range([height - 10, 0] as number[]);
  const scaleBody = d3
    .scaleLinear()
    .domain([0, domain[1] - domain[0]] as number[])
    .range([0, height - 10] as number[]);

  return (
    <svg width={width} height={height}>
      <g>
        <line x1={0} y1={height} x2={width} y2={height} stroke="black" />
      </g>
      <g>
        <line x1={width} y1={0} x2={width} y2={height} stroke="black" />
      </g>
      {candles.map((candle, index) => (
        <Candle
          candle={candle}
          width={width / candles.length}
          index={index}
          scaleY={scaleY}
          scaleBody={scaleBody}
        />
      ))}
    </svg>
  );
};

export default Chart;
