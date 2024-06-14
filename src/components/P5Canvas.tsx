import p5 from "p5";
import { useEffect, useRef, useState } from "react";
import { sketch } from "../assets/brushPenSketch";

const P5Canvas = () => {
  const [p5Instance, setP5Instance] = useState<p5 | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const testColorSwitch = (p5Instance: p5) => p5Instance.fill(0);
  useEffect(() => {
    const myP5: p5 = new p5(sketch, canvasRef.current!);
    setP5Instance(myP5);
    return myP5.remove;
  }, []);
  return (
    <div
      className="w-fit"
      ref={canvasRef}
      onClick={() => testColorSwitch(p5Instance!)}
    ></div>
  );
};

export default P5Canvas;
