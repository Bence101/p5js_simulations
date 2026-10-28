"use strict";

const maximumBalls = 10;
const initialVelocityX = 180;
const initialVelocityY = 135;
let balls = [];
let ballColor;
let ballDiameter;
let collisionEnabled;

function setup() {
  const stage = document.getElementById("sketch");
  const canvasWidth = Math.max(1, Math.floor(stage.getBoundingClientRect().width));
  const canvas = createCanvas(canvasWidth, Math.max(1, Math.round(canvasWidth * 10 / 16)));
  canvas.parent(stage);
  noStroke();

  ProjectPage.connect({
    applySettings(settings) {
      ballColor = settings.color;
      ballDiameter = settings.diameter;
      collisionEnabled = settings.collisions;
      keepBallsInBounds();
    },
    restart: restartSimulation,
  });

  const observer = new ResizeObserver(([entry]) => {
    const nextWidth = Math.max(1, Math.floor(entry.contentRect.width));
    const nextHeight = Math.max(1, Math.round(nextWidth * 10 / 16));
    if (width !== nextWidth || height !== nextHeight) {
      resizeCanvas(nextWidth, nextHeight);
      keepBallsInBounds();
    }
  });
  observer.observe(stage);
  describe("Balls bouncing off the edges of a pale green canvas.");
}

function draw() {
  const seconds = Math.min(deltaTime / 1000, 0.05);
  const radius = getBallRadius();

  for (const ball of balls) {
    ball.x += ball.velocityX * seconds;
    ball.y += ball.velocityY * seconds;
    bounceOffWalls(ball, radius);
  }

  if (collisionEnabled) {
    resolveBallCollisions(radius);
  }

  background("#e4ece8");
  fill(ballColor);
  for (const ball of balls) {
    circle(ball.x, ball.y, radius * 2);
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  const radius = getBallRadius();
  for (let i = balls.length - 1; i >= 0; i--) {
    const dx = mouseX - balls[i].x;
    const dy = mouseY - balls[i].y;
    if (dx * dx + dy * dy <= radius * radius) {
      balls.splice(i, 1);
      return;
    }
  }

  if (balls.length < maximumBalls) {
    const angle = random(TWO_PI);
    balls.push({
      x: constrain(mouseX, radius, width - radius),
      y: constrain(mouseY, radius, height - radius),
      velocityX: Math.cos(angle) * Math.hypot(initialVelocityX, initialVelocityY),
      velocityY: Math.sin(angle) * Math.hypot(initialVelocityX, initialVelocityY),
    });
  }
}

function restartSimulation(settings) {
  const count = constrain(settings.count, 1, maximumBalls);
  const radius = getBallRadius();
  balls = [];

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      balls.push({
        x: constrain(70, radius, width - radius),
        y: constrain(70, radius, height - radius),
        velocityX: initialVelocityX,
        velocityY: initialVelocityY,
      });
      continue;
    }

    const position = findBallPosition(radius);
    const angle = random(TWO_PI);
    const speed = Math.hypot(initialVelocityX, initialVelocityY);
    balls.push({
      x: position.x,
      y: position.y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
    });
  }
}

function findBallPosition(radius) {
  const minimumDistance = radius * 2;
  for (let attempt = 0; attempt < 100; attempt++) {
    const position = {
      x: random(radius, width - radius),
      y: random(radius, height - radius),
    };
    if (balls.every((ball) => dist(position.x, position.y, ball.x, ball.y) >= minimumDistance)) {
      return position;
    }
  }
  return {
    x: random(radius, width - radius),
    y: random(radius, height - radius),
  };
}

function getBallRadius() {
  return Math.min(ballDiameter / 2, width / 2, height / 2);
}

function keepBallsInBounds() {
  const radius = getBallRadius();
  for (const ball of balls) {
    ball.x = constrain(ball.x, radius, width - radius);
    ball.y = constrain(ball.y, radius, height - radius);
  }
}

function bounceOffWalls(ball, radius) {
  if (ball.x >= width - radius || ball.x <= radius) {
    ball.x = constrain(ball.x, radius, width - radius);
    ball.velocityX *= -1;
  }

  if (ball.y >= height - radius || ball.y <= radius) {
    ball.y = constrain(ball.y, radius, height - radius);
    ball.velocityY *= -1;
  }
}

function resolveBallCollisions(radius) {
  const minimumDistance = radius * 2;
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const first = balls[i];
      const second = balls[j];
      let dx = second.x - first.x;
      let dy = second.y - first.y;
      let distance = Math.hypot(dx, dy);

      if (distance >= minimumDistance) {
        continue;
      }

      if (distance === 0) {
        dx = 1;
        dy = 0;
        distance = 1;
      }

      const normalX = dx / distance;
      const normalY = dy / distance;
      const overlap = (minimumDistance - distance) / 2;
      first.x -= normalX * overlap;
      first.y -= normalY * overlap;
      second.x += normalX * overlap;
      second.y += normalY * overlap;

      const relativeVelocity =
        (second.velocityX - first.velocityX) * normalX
        + (second.velocityY - first.velocityY) * normalY;
      if (relativeVelocity < 0) {
        first.velocityX += relativeVelocity * normalX;
        first.velocityY += relativeVelocity * normalY;
        second.velocityX -= relativeVelocity * normalX;
        second.velocityY -= relativeVelocity * normalY;
      }
    }
  }
  keepBallsInBounds();
}