import type p5 from "p5";
export const sketch = (s: p5) => {
  s.setup = () => {
    s.createCanvas(500, 500);
    s.background(200);
  };
  s.draw = () => {
    //   s.background(255);
    s.fill("red");
    if (s.mouseIsPressed) s.circle(s.mouseX, s.mouseY, 50);
  };
  s.mousePressed = () => {
    s.circle(s.mouseX, s.mouseY, 10);
  };
  s.keyPressed = () => {
    switch (s.key) {
      case "c":
        s.background(200);
    }
  };
};
