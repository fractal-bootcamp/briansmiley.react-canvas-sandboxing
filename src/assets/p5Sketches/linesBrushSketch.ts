import type p5 from "p5";
export const sketch = (s: p5) => {
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(200);
    s.fill("black");
    s.angleMode(s.DEGREES);
  };
  let inStroke = true;
  const lines = {
    brushX: 0,
    brushY: 0,
    currentStrokeLength: 0,
    LINES: 5,
    lineSpacing: 5,
    /**parameters which vary the spacing between the parallel lines; we may want to set these generally and not once per stroke */
    lineSpacingVar: 0.6,
    lineSpacingOffsets: [0],
    lineWeight: 2, //baseline line width, will be  +/-'d with granularity
    crossAxisNoiseParam: 0,
    crossAxisNoiseIncrement: 0.001,
    spring: 0.5,
    lerpStepSize: 3,
    granularity: 1.5, //line weight variation
    roughness: 1, //line path variation
    penAngle: 75
  };
  s.draw = () => {
    //   s.background(255);
    if (s.mouseIsPressed && inStroke) {
      const dx = s.mouseX - lines.brushX;
      const dy = s.mouseY - lines.brushY;
      const d = Math.sqrt(dx ** 2 + dy ** 2);
      const vx = dx * lines.spring;
      const vy = dy * lines.spring;
      // const v = Math.sqrt(vx ** 2 + vy ** 2);
      const prevX = lines.brushX;
      const prevY = lines.brushY;
      lines.brushX += vx;
      lines.brushY += vy;
      s.beginShape();
      const steps = d / lines.lerpStepSize;
      //loop for each of the parallel lines
      for (let j = 0; j < lines.LINES; j++) {
        const lineOffset =
          j -
          (lines.LINES - 1) / 2 +
          (lines.lineSpacingOffsets.length === lines.LINES
            ? lines.lineSpacingOffsets[j]
            : 0);
        for (let i = 0; i < steps; i++) {
          const lerpX = s.lerp(prevX, lines.brushX, i / steps);
          const lerpY = s.lerp(prevY, lines.brushY, i / steps);
          s.strokeWeight(
            lines.lineWeight + s.random(-0.5, 0.5) * lines.granularity
          );
          // const lineSpacing = lines.lineSpacing + s.random();
          s.line(
            prevX + lineOffset * lines.lineSpacing * Math.cos(lines.penAngle),
            prevY + lineOffset * lines.lineSpacing * Math.sin(lines.penAngle),
            lerpX +
              lineOffset * lines.lineSpacing * Math.cos(lines.penAngle) +
              s.random(lines.roughness),
            lerpY +
              lineOffset * lines.lineSpacing * Math.sin(lines.penAngle) +
              s.random(lines.roughness)
          );
        }
      }
    }
  };
  s.mousePressed = () => {
    inStroke = true;
    [lines.brushX, lines.brushY] = [s.mouseX, s.mouseY];
    lines.lineSpacingOffsets = Array.from({ length: lines.LINES }, () =>
      s.random(-lines.lineSpacingVar / 2, lines.lineSpacingVar / 2)
    );
  };
  s.mouseReleased = () => {
    inStroke = false;
  };
  s.keyPressed = () => {
    switch (s.key) {
      case "c":
        s.background(200);
    }
  };
};
