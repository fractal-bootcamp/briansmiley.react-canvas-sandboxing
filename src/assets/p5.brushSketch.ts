import type p5 from "p5";
import * as brush from "p5.brush";

export const sketch = (s: p5) => {
  const palette = [
    "#2c695a",
    "#4ad6af",
    "#7facc6",
    "#4e93cc",
    "#f6684f",
    "#ffd300"
  ];
  let prevPosition = [0, 0];
  brush.instance(s);
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight, s.WEBGL);
    s.angleMode(s.DEGREES);
    s.background(200);
    s.fill("red");
    brush.scaleBrushes(0.5);
    brush.field("seabed");
  };
  s.draw = () => {
    const endPosition = [s.mouseX - s.width / 2, s.mouseY - s.height / 2];
    const dx = endPosition[0] - prevPosition[0];
    const dy = endPosition[1] - prevPosition[1];
    const d = s.sqrt(dy ** 2 + dx ** 2);
    const angle = s.atan(-dy / dx) + (dx < 0 ? 180 : 0);
    //   s.background(255);
    if (s.mouseIsPressed) {
      // s.line(prevPosition[0], prevPosition[1], endPosition[0], endPosition[1]);
      // s.circle(endPosition[0], endPosition[1], 10);
      brush.flowLine(prevPosition[0], prevPosition[1], d, angle);
    }
    prevPosition = endPosition;
  };
  s.mousePressed = () => {
    brush.set(s.random(brush.box()), s.random(palette), 15);
  };
  s.keyPressed = () => {
    switch (s.key) {
      case "c":
        s.background(200);
    }
  };
};
