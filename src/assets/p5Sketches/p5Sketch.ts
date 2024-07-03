import p5 from "p5";
const sketch = (s: p5) => {
  let buffer: p5.Graphics;
  const undoBufferStack: p5.Image[] = [];
  const BACKGROUND_COLOR = 235;
  const state = p5PassInRef; //gives the p5 sketch access to all the component props
  let inStroke = false;
  let localBufferClearSwitch = state.current.canvasClearSwitch;
  let localUndoSwitch = state.current.canvasUndoSwitch;
  /**namespaces for each brush option */
  const ink = {
    BRUSH_SIZE: 17, //make configurable later?
    VEL_DEPENDENT_SHADE: false, //make the stroke lighter the faster the brush moves
    previousStrokeWidth: 0, //stroke width on prior frame
    FRICTION: 1.5, //divides velocity

    SPRING: 0.5,
    velocityScaling: 50,
    brushX: 0,
    brushY: 0,
    currentStrokeTotalLength: 0
  };
  const brush1 = {
    brushSize: 15,
    f: true,
    spring: 0.4,
    friction: 0.45,
    v: 0.5,
    vScale: 1,
    r: 0,
    vx: 0,
    vy: 0,
    splitNum: 100,
    diff: 2,
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
    oldR: 0
  };
  const spray = {
    pMouseX: 0,
    pMouseY: 0,
    minRadius: 5,
    sprayDensity: 5,
    lerps: 100,
    speedScaling: 0.04,
    prevR: 0,
    prevSpeed: 0
  };
  const streak = {
    vx: 0,
    vy: 0,
    friction: 0.5,
    spring: 0.5,
    oldR: 0,
    oldX: 0,
    oldY: 0,
    brushX: 0,
    brushY: 0,
    splitNum: 30,
    brushRadius: 10,
    baseBrushSize: 10,
    brushOffset: 5,
    minRadius: 1
  };
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
  s.setup = () => {
    s.createCanvas(canvasWidth, canvasWidth * ASPECT_RATIO);
    s.background(BACKGROUND_COLOR);
    buffer = s.createGraphics(s.width, s.height);
    // undoBuffer = s.createGraphics(s.width, s.height)
    s.noStroke();
    buffer.noStroke();
  };
  s.draw = () => {
    buffer.fill(state.current.activeColor);
    buffer.stroke(state.current.activeColor);
    writeBackground(s);
    switch (state.current.currentBrush || "default") {
      case "brush1":
        /** adapted from  https://editor.p5js.org/AhmadMoussa/sketches/SlFQgTID_  */
        /*
        Draw multiple lines with different positions and thicknesses, 
        and make it look like a brush
      */
        /*
        Parameters used
          size : Brush size
          spring : Spring constant(Larger value means stronger spring)
          friction : Friction(Smaller value means, the more slippery)
          splitNum : Number of divisions from old coordinates to new coordinates
          diff : Misalignment of different lines
      */
        if (s.mouseIsPressed && inStroke) {
          if (!brush1.f) {
            brush1.f = true;
            brush1.x = s.mouseX;
            brush1.y = s.mouseY;
          }
          brush1.vx += (s.mouseX - brush1.x) * brush1.spring;
          brush1.vy += (s.mouseY - brush1.y) * brush1.spring;
          brush1.vx *= brush1.friction;
          brush1.vy *= brush1.friction;

          brush1.v +=
            s.sqrt(brush1.vx * brush1.vx + brush1.vy * brush1.vy) - brush1.v;
          brush1.v *= 0.55;

          brush1.oldR = brush1.r;
          brush1.r = brush1.brushSize - brush1.v * brush1.vScale;
          var num = s.random(0.1, 1);
          for (let i = 0; i < brush1.splitNum; ++i) {
            brush1.oldX = brush1.x;
            brush1.oldY = brush1.y;
            brush1.x += brush1.vx / brush1.splitNum;
            brush1.y += brush1.vy / brush1.splitNum;
            brush1.oldR += (brush1.r - brush1.oldR) / brush1.splitNum;
            if (brush1.oldR < 1) {
              brush1.oldR = 1;
            }
            buffer.strokeWeight(brush1.oldR + brush1.diff); // AMEND: oldR -> oldR+brush1.diff
            buffer.line(
              brush1.x + s.random(0, 2),
              brush1.y + s.random(0, 2),
              brush1.oldX + s.random(0, 2),
              brush1.oldY + s.random(0, 2)
            );
            buffer.strokeWeight(brush1.oldR); // ADD
            buffer.line(
              brush1.x + brush1.diff * s.random(0.1, 2),
              brush1.y + brush1.diff * s.random(0.1, 2),
              brush1.oldX + brush1.diff * s.random(0.1, 2),
              brush1.oldY + brush1.diff * s.random(0.1, 2)
            ); // ADD
            buffer.line(
              brush1.x - brush1.diff * s.random(0.1, 2),
              brush1.y - brush1.diff * s.random(0.1, 2),
              brush1.oldX - brush1.diff * s.random(0.1, 2),
              brush1.oldY - brush1.diff * s.random(0.1, 2)
            ); // ADD
          }
        } else if (brush1.f) {
          brush1.vx = brush1.vy = 0;
          brush1.f = false;
        }
        break;
      case "ink":
        const maxBRUSH_SIZE = Math.min(
          (ink.BRUSH_SIZE / 2) * (1 + ink.currentStrokeTotalLength / 1000),
          ink.BRUSH_SIZE
        );
        const dx = s.mouseX - ink.brushX;
        const dy = s.mouseY - ink.brushY;
        const vel = s.sqrt(dx ** 2 + dy ** 2);
        ink.currentStrokeTotalLength += vel;
        const velocityStrokeScaling = vel / ink.velocityScaling;
        const velocityShadeScaling = ink.VEL_DEPENDENT_SHADE ? vel / 2 : 0;
        const strokeSize = Math.min(
          maxBRUSH_SIZE,
          s.max(ink.BRUSH_SIZE / (1 + velocityStrokeScaling), 1)
        );
        //To lighten depending on velocity
        const scaledStrokeShade = s.min(
          BACKGROUND_COLOR * 0.75,
          s.brightness(state.current.activeColor) * 2.55 + velocityShadeScaling
        );
        if (s.mouseIsPressed && inStroke) {
          //   s.fill(127 * (1 + 0.5 * s.sin(s.frameCount * 3)));

          let vx = (dx * ink.SPRING) / 2;
          let vy = (dy * ink.SPRING) / 2;
          vx /= ink.FRICTION;
          vy /= ink.FRICTION;
          const [prevX, prevY] = [ink.brushX, ink.brushY];
          ink.brushX += vx;
          ink.brushY += vy;

          taperLine(
            buffer,
            prevX,
            prevY,
            ink.brushX,
            ink.brushY,
            ink.previousStrokeWidth,
            strokeSize,
            true
          );
        }
        ink.previousStrokeWidth = strokeSize;
        break;
      case "spray":
        //adapted from https://library.superhi.com/posts/how-to-paint-with-code-creating-paintbrushes
        if (s.mouseIsPressed && inStroke) {
          // set the color and brush style
          buffer.strokeWeight(1);

          // find the speed of the mouse movement
          const speed =
            s.abs(s.mouseX - spray.pMouseX) + s.abs(s.mouseY - spray.pMouseY);
          let r = spray.prevR;

          // repeat the random points with lerping
          for (let i = 0; i < spray.lerps; i++) {
            // find the lerped X and Y coordinates
            const lerpX = s.lerp(spray.pMouseX, s.mouseX, i / spray.lerps);
            const lerpY = s.lerp(spray.pMouseY, s.mouseY, i / spray.lerps);
            const lerpedSpeed = s.lerp(spray.prevSpeed, speed, i / spray.lerps);
            // find radius of the spray paint brush and radius squared
            r = (lerpedSpeed + spray.minRadius) * spray.speedScaling;
            spray.prevR = r;
            // draw a bunch of random points within a circle
            for (
              let j = 0;
              j < spray.sprayDensity * speed * spray.speedScaling;
              j++
            ) {
              // pick a random position within the circle
              const randX = s.random(-r, r);
              const randY = s.random(-1, 1) * s.sqrt(r * r - randX * randX);

              // draw the random point
              buffer.point(lerpX + randX, lerpY + randY);
            }
          }
          spray.pMouseX = s.mouseX;
          spray.pMouseY = s.mouseY;
          spray.prevSpeed = speed;
        }
        break;
      case "streak":
        //taken from https://openprocessing.org/sketch/793375?ref=gorillasun.de
        if (s.mouseIsPressed && inStroke) {
          streak.vx = (s.mouseX - streak.brushX) * streak.spring;
          streak.vy = (s.mouseY - streak.brushY) * streak.spring;
          streak.vx *= streak.friction;
          streak.vy *= streak.friction;

          let v = s.sqrt(streak.vx ** 2 + streak.vy ** 2);
          v *= 0.6;

          streak.oldR = streak.brushRadius;
          streak.brushRadius = streak.baseBrushSize - v;

          for (let i = 0; i < streak.splitNum; ++i) {
            streak.oldX = streak.brushX;
            streak.oldY = streak.brushY;
            streak.brushX += streak.vx / streak.splitNum;
            streak.brushY += streak.vy / streak.splitNum;
            const startR = s.max(streak.oldR, streak.minRadius);
            streak.oldR += (streak.brushRadius - streak.oldR) / streak.splitNum;
            if (streak.oldR < streak.minRadius) {
              streak.oldR = streak.minRadius;
            }
            taperLine(
              buffer,
              streak.oldX,
              streak.oldY,
              streak.brushX,
              streak.brushY,
              startR,
              streak.oldR + streak.brushOffset,
              true
            );
            taperLine(
              buffer,
              streak.oldX + streak.brushOffset * 2,
              streak.oldY + streak.brushOffset * 2,
              streak.brushX + streak.brushOffset * 2,
              streak.brushY + streak.brushOffset * 2,
              startR,
              streak.oldR,
              true
            );
            taperLine(
              buffer,
              streak.oldX - streak.brushOffset,
              streak.oldY - streak.brushOffset,
              streak.brushX - streak.brushOffset,
              streak.brushY - streak.brushOffset,
              startR,
              streak.oldR,
              true
            );
          }
        }
        break;
      case "lines":
        if (s.mouseIsPressed && inStroke) {
          const dx = s.mouseX - lines.brushX;
          const dy = s.mouseY - lines.brushY;
          const d = Math.sqrt(dx ** 2 + dy ** 2);
          const vx = dx * lines.spring;
          const vy = dy * lines.spring;
          const v = Math.sqrt(vx ** 2 + vy ** 2);
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
              buffer.strokeWeight(
                lines.lineWeight + s.random(-0.5, 0.5) * lines.granularity
              );
              // const lineSpacing = lines.lineSpacing + s.random();
              buffer.line(
                prevX +
                  lineOffset * lines.lineSpacing * Math.cos(lines.penAngle),
                prevY +
                  lineOffset * lines.lineSpacing * Math.sin(lines.penAngle),
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
    }

    s.image(buffer, 0, 0);
    //if the clear switch has been toggled by the toolbar, we save an undo frame, clear, and align the local tracking variable to match it so we cathc the next flip
    if (state.current.canvasClearSwitch != localBufferClearSwitch) {
      saveUndoFrame();
      buffer.clear();

      localBufferClearSwitch = state.current.canvasClearSwitch;
    }
    //If the undo switch is tripped, clear the buffer, image the undo buffer (should be one stroke behind) and remove that undo frame from the stack
    if (state.current.canvasUndoSwitch != localUndoSwitch) {
      undo();
      localUndoSwitch = state.current.canvasUndoSwitch;
    }
  };

  /**Our click/touch handlers check if mouse is in canvas and ignore it if not */
  s.mousePressed = () => {
    if (mouseOffCanvas()) return;
    onStrokeStart();
  };
  s.touchStarted = () => {
    if (mouseOffCanvas()) return;
    onStrokeStart();
  };
  s.touchEnded = () => {
    inStroke = false;
  };
  s.mouseReleased = () => {
    inStroke = false;
  };
  const onStrokeStart = () => {
    /**Set the stroking status to true (so draw() knows to draw; this decouples drawing state from All mouseIsPressed() situations) */
    inStroke = true;
    /** Whenever we start a drawing move, first save the pre-stroke state as a frame in the undo stack */
    saveUndoFrame();

    /** Reset the brush position/velocity and total stroke lenghth */
    ink.currentStrokeTotalLength = 0;
    [ink.brushX, ink.brushY] = [s.mouseX, s.mouseY];
    [spray.pMouseX, spray.pMouseY] = [s.mouseX, s.mouseY];
    [streak.brushX, streak.brushY] = [s.mouseX, s.mouseY];
    [lines.brushX, lines.brushY] = [s.mouseX, s.mouseY];
    lines.lineSpacingOffsets = Array.from({ length: lines.LINES }, () =>
      s.random(-lines.lineSpacingVar / 2, lines.lineSpacingVar / 2)
    );
  };
  const undo = () => {
    if (undoBufferStack.length === 0) return;
    buffer.clear();
    buffer.image(undoBufferStack.pop()!, 0, 0);
  };

  const saveUndoFrame = () => {
    buffer.loadPixels(); //load the pixels array for the buffer
    const newUndoBufferFrame = buffer.get(); //get it as a p5.Image object
    undoBufferStack.push(newUndoBufferFrame); //push it onto the undo state stack
    if (undoBufferStack.length > 150)
      undoBufferStack.splice(0, undoBufferStack.length - 150);
  };
  const mouseOffCanvas = () =>
    s.mouseX > s.width || s.mouseX < 0 || s.mouseY > s.height || s.mouseY < 0;
  //Function to draw a tapered line (trapezoid) for smoothness
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
  /**write the background (lines/grid/etc) to a graphics element */
  const writeBackground = (g: p5.Graphics | p5) => {
    g.push();
    g.background(BACKGROUND_COLOR);
    const GRID_COUNT = 15;
    const GRID_SIZE = g.width / (GRID_COUNT + 1);
    switch (state.current.backgroundStyle) {
      case "grid":
        g.stroke(220);
        g.strokeWeight(3);
        g.fill(BACKGROUND_COLOR);
        for (let i = 0; i < GRID_COUNT; i++) {
          for (let j = 0; j < g.height / GRID_SIZE - 1; j++) {
            g.rect(GRID_SIZE * (0.5 + i), GRID_SIZE * (0.5 + j), GRID_SIZE);
          }
        }
        break;
      case "dots":
        g.fill(125);
        for (let i = 0; i < 16; i++) {
          for (let j = 0; j < g.height / GRID_SIZE; j++) {
            g.circle(GRID_SIZE * (0.5 + i), GRID_SIZE * (0.5 + j), 4);
          }
        }
        break;
      case "lines":
        const LINE_COUNT = 25;
        const LINE_SPACING = (g.height - GRID_SIZE) / LINE_COUNT;
        g.stroke(215);
        g.strokeWeight(2);
        for (let i = 0; i <= LINE_COUNT; i++) {
          g.line(
            GRID_SIZE / 2,
            GRID_SIZE / 2 + i * LINE_SPACING,
            g.width - GRID_SIZE / 2,
            GRID_SIZE / 2 + i * LINE_SPACING
          );
        }
        break;
      case "blank":
        break;
    }
    g.pop();
  };
};
