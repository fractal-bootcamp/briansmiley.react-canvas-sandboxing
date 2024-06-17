import type p5 from "p5";
export const sketch = (s: p5) => {
  const brushSize = 25;
  const brushShade = 0;
  const BACKGROUND_COLOR = 200;
  const SHADE = false;
  let prevStroke = 0;
  let friction = 0.4;
  let spring = 0.5;
  let [vx, vy] = [0, 0];
  let [brushX, brushY] = [0, 0];
  let currentStrokeTotalLength = 0;
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(BACKGROUND_COLOR);
    s.noStroke();
    s.fill(0);
  };
  s.draw = () => {
    const maxBrushSize = Math.min(
      (brushSize / 2) * (1 + currentStrokeTotalLength / 1000),
      brushSize
    );
    const dx = s.mouseX - brushX;
    const dy = s.mouseY - brushY;
    const vel = s.sqrt(dx ** 2 + dy ** 2);
    currentStrokeTotalLength += vel;
    const velocityStrokeScaling = vel / 100;
    const velocityShadeScaling = SHADE ? vel / 2 : 0;
    const strokeSize = Math.min(
      maxBrushSize,
      s.max(brushSize / (1 + velocityStrokeScaling), 1)
    );
    const strokeShade = s.min(
      BACKGROUND_COLOR * 0.75,
      brushShade + velocityShadeScaling
    );
    spring;
    if (s.mouseIsPressed) {
      //   s.fill(127 * (1 + 0.5 * s.sin(s.frameCount * 3)));

      vx += (dx * spring) / 2;
      vy += (dy * spring) / 2;
      vx *= friction;
      vy *= friction;
      const [prevX, prevY] = [brushX, brushY];
      (brushX += vx), (brushY += vy);

      taperLine(s, prevX, prevY, brushX, brushY, prevStroke, strokeSize, true);
    }
    prevStroke = strokeSize;
  };
  s.mousePressed = () => {
    currentStrokeTotalLength = 0;
    [brushX, brushY] = [s.mouseX, s.mouseY];
    [vx, vy] = [0, 0];
  };
  s.keyPressed = () => {
    switch (s.key) {
      case "c":
        s.background(200);
    }
  };
  function taperLine(
    s: p5,
    start_x: number,
    start_y: number,
    end_x: number,
    end_y: number,
    start_width: number,
    end_width: number,
    endRound = false
  ) {
    s.push();
    s.angleMode(s.DEGREES);
    let deltaX = end_x - start_x;
    let deltaY = end_y - start_y;
    let distance = s.sqrt(deltaX ** 2 + deltaY ** 2);
    let slope = s.atan2(deltaY, deltaX);
    s.translate(start_x, start_y);
    s.rotate(-90 + slope);

    s.beginShape();
    s.vertex(-start_width / 2, 0);
    s.vertex(start_width / 2, 0);
    s.vertex(end_width / 2, distance);
    s.vertex(-end_width / 2, distance);
    s.endShape(s.CLOSE);
    if (endRound) {
      s.circle(0, 0, start_width);
      s.circle(0, distance, end_width);
    }
    s.pop();
  }
};
