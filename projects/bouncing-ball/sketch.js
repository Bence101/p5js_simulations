"use strict";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BACKGROUND_COLOR = 220;
const BASE_STEP = { x: 10, y: 20 };
const BALL_ALPHA = 50;
const DEFAULTS = {
  color: "#64c8c8",
  speed: 1,
  diameter: 20,
  trails: true
};

let sign = { x: 1, y: 1 };
let myCircle = { x: 0, y: 0, diameter: DEFAULTS.diameter };
let ballColor;
let ballSpeed = DEFAULTS.speed;
let showTrail = DEFAULTS.trails;

function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("sketch");
  background(BACKGROUND_COLOR);
  frameRate(60);

  window.ProjectPage.connect({
    canvas,
    defaults: DEFAULTS,
    applySettings(settings) {
      const selectedColor = color(settings.color);
      ballColor = {
        red: red(selectedColor),
        green: green(selectedColor),
        blue: blue(selectedColor)
      };
      ballSpeed = settings.speed;
      myCircle.diameter = settings.diameter;
      showTrail = settings.trails;
    },
    restart() {
      background(BACKGROUND_COLOR);
      sign = { x: 1, y: 1 };
      myCircle = { x: 0, y: 0, diameter: myCircle.diameter };
    }
  });
}

function draw() {
  if (!mouseIsPressed) {
    if (!showTrail) {
      background(BACKGROUND_COLOR);
    }
    drawEllipse();
  }
  if (myCircle.x > CANVAS_WIDTH) {
    sign.x = sign.x * -1;
  }
  if (myCircle.x < 0) {
    sign.x = sign.x * -1;
  }
  if (myCircle.y > CANVAS_HEIGHT) {
    sign.y = sign.y * -1;
  }
  if (myCircle.y < 0) {
    sign.y = sign.y * -1;
  }
}

function mousePressed() {
  background(BACKGROUND_COLOR);
}

function drawEllipse() {
  noStroke();
  fill(ballColor.red, ballColor.green, ballColor.blue, BALL_ALPHA);
  ellipse(myCircle.x, myCircle.y, myCircle.diameter, myCircle.diameter);
  myCircle.x = myCircle.x + (BASE_STEP.x * ballSpeed * sign.x);
  myCircle.y = myCircle.y + (BASE_STEP.y * ballSpeed * sign.y);
}
