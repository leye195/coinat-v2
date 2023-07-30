type Props = {
  width: number;
  height: number;
};

const VolumnChart = ({ width, height }: Props) => {
  return (
    <svg width={width} height={height}>
      <g>
        <line x1={0} y1={height} x2={width} y2={height} stroke="black" />
      </g>
      <g>
        <line x1={width} y1={0} x2={width} y2={height} stroke="black" />
      </g>
    </svg>
  );
};

export default VolumnChart;
