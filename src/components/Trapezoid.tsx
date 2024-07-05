import { Line } from "react-konva";
interface TrapezoidProps {
  x: number;
  y: number;
  startWidth: number;
  endWidth: number;
  length: number;
  angle: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
}
export const Trapezoid = (props: TrapezoidProps) => {
  return (
    <Line
      x={props.x}
      y={props.y}
      points={[
        -props.startWidth / 2,
        0,
        -props.endWidth / 2,
        props.length,
        props.endWidth / 2,
        props.length,
        props.startWidth / 2,
        0
      ]}
      closed
      fill={props.fill}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
      rotation={props.rotation}
    />
  );
};
