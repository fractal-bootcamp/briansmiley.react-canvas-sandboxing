import p5 from "p5";
import { useEffect, useRef, useState } from "react";
import { sketch as penSketch } from "../assets/brushPenSketch";
import { sketch as brushSketch } from "../assets/p5.brushSketch";
import { sketch as linesSketch } from "../assets/linesBrushSketch";
//choose brush pen or p5.brush for canvas sketch
const sketch = linesSketch;
const P5Canvas = () => {
  const [p5Instance, setP5Instance] = useState<p5 | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const myP5: p5 = new p5(sketch, canvasRef.current!);
    setP5Instance(myP5);
    return myP5.remove;
  }, []);
  return <div className="w-fit" ref={canvasRef}></div>;
};

export default P5Canvas;
