import { Stage, Layer } from "react-konva";
import { Trapezoid } from "./Trapezoid";
import { useState, useEffect } from "react";

const steps = 60;
export const KonvaStage = () => {
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRotation(prev => prev + 360 / steps);
    }, 1000 / steps);

    return () => clearTimeout(timeout);
  }, [rotation]);
  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Trapezoid
          x={100}
          y={100}
          startWidth={100}
          endWidth={70}
          length={100}
          angle={0}
          fill="red"
          stroke="none"
          strokeWidth={0}
          rotation={rotation}
        />
      </Layer>
    </Stage>
  );
};
