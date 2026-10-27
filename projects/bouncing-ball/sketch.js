"use strict";

const ball = {
  x: 70,
  y: 70,
  radius: 18,
  velocityX: 180,
  velocityY: 135,
};

function setup() {
  const stage = document.getElementById("sketch");
  const canvas = createCanvas(stage.clientWidth, stage.clientHeight);
  canvas.parent(stage);
  describe("A coral ball bouncing off the edges of a pale green canvas.");
  noStroke();
}

function draw() {
  const seconds = Math.min(deltaTime / 1000, 0.05);
  ball.x += ball.velocityX * seconds;
  ball.y += ball.velocityY * seconds;

  if (ball.x >= width - ball.radius || ball.x <= ball.radius) {
    ball.x = constrain(ball.x, ball.radius, width - ball.radius);
    ball.velocityX *= -1;
  }

  if (ball.y >= height - ball.radius || ball.y <= ball.radius) {
    ball.y = constrain(ball.y, ball.radius, height - ball.radius);
    ball.velocityY *= -1;
  }

  background("#e4ece8");
  fill("#e8664a");
  circle(ball.x, ball.y, ball.radius * 2);
}

function windowResized() {
  const stage = document.getElementById("sketch");
  resizeCanvas(stage.clientWidth, stage.clientHeight);
  ball.x = constrain(ball.x, ball.radius, width - ball.radius);
  ball.y = constrain(ball.y, ball.radius, height - ball.radius);
}