

"use strict";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BACKGROUND_COLOR = 220;
const DEFAULTS = {
  color: "#64c8c8",
  maxStep: 5
};

let sign = { x: 1, y: 1 };
let seed = { x: 0, y: 0 };
let myCircle = { x: 100, y: 100, diameter: 20 };
let walkColor = DEFAULTS.color;
let maxStep = DEFAULTS.maxStep;

function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("sketch");
  background(BACKGROUND_COLOR);
  frameRate(120);

  ProjectPage.connect({
    canvas,
    defaults: DEFAULTS,
    applySettings(settings) {
      walkColor = settings.color;
      maxStep = settings.maxStep;
    },
    restart() {
      background(BACKGROUND_COLOR);
      sign = { x: 1, y: 1 };
      seed = { x: 0, y: 0 };
      myCircle = { x: 100, y: 100, diameter: 20 };
    }
  });
}

function draw() {
  if (!mouseIsPressed) {
    drawEllipse();
  }
  seed.x = random(-maxStep, maxStep);
  seed.y = random(-maxStep, maxStep);
  if (myCircle.x > width) {
    sign.x = sign.x * -1;
  }
  if (myCircle.x < 0) {
    sign.x = sign.x * -1;
  }
  if (myCircle.y > height) {
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
  fill(walkColor);
  ellipse(myCircle.x, myCircle.y, 10, 10);
  myCircle.x = myCircle.x + (seed.x * sign.x);
  myCircle.y = myCircle.y + (seed.y * sign.y);
}


