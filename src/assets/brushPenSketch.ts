import type p5 from "p5";
export const sketch = (s: p5) => {
  const brushSize = 25;
  const brushShade = 0;
  const BACKGROUND_COLOR = 200;
  let friction = 0.2;
  let spring = 0.7;
  let [vx, vy] = [0, 0];
  let [brushX, brushY] = [0, 0];
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(BACKGROUND_COLOR);
    s.fill(0);
  };
  s.draw = () => {
    const dx = s.mouseX - brushX;
    const dy = s.mouseY - brushY;
    const vel = s.sqrt(dx ** 2 + dy ** 2);
    const velocityStrokeScaling = vel / 90;
    const velocityShadeScaling = vel / 2;
    const strokeSize = s.max(brushSize / (1 + velocityStrokeScaling), 1);
    const strokeShade = s.min(
      BACKGROUND_COLOR * 0.75,
      brushShade + velocityShadeScaling
    );
    if (s.mouseIsPressed) {
      s.stroke(strokeShade);
      s.strokeWeight(strokeSize);
      vx += dx * spring;
      vy += dy * spring;
      vx *= friction;
      vy *= friction;
      const [prevX, prevY] = [brushX, brushY];
      brushX += vx;
      brushY += vy;
      s.line(prevX, prevY, brushX, brushY);
      //   s.circle(brushX, brushY, strokeSize);
    }
  };
  s.mousePressed = () => {
    [brushX, brushY] = [s.mouseX, s.mouseY];
    [vx, vy] = [0, 0];
  };
  s.keyPressed = () => {
    switch (s.key) {
      case "c":
        s.background(200);
    }
  };
};
