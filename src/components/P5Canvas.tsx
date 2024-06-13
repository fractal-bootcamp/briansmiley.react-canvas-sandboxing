import p5 from "p5";
import { useEffect, useRef } from "react";
import { sketch } from "../assets/p5Sketch";

const P5Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p5Instance = new p5(sketch, canvasRef.current!);
    return p5Instance.remove;
  }, []);
  return <div ref={canvasRef}>Canvas Goes here</div>;
};

export default P5Canvas;
