// Feladatok
/*
  - a kódot rendbe kell tenni
*/

var n_boids = 50;
var n_chasers = 0;
var n_obstacles = 0;
var boids = [];
var chasers = [];
var obstacles = [];
var targetX;
var targetY;
var showDistance = 0;
var avoidWalls = 0;
var onClickAction;
var canvas;
var flockingSettings;

function setup() {
  frameRate(60);
  canvas = createCanvas(800, 600);
  canvas.parent('sketch');
  document.getElementById('simulation-controls').addEventListener('click', function(event) {
    const button = event.target.closest('button[data-reset-slider]');
    if (!button) {
      return;
    }
    const slider = document.getElementById(button.dataset.resetSlider);
    slider.value = slider.defaultValue;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  ProjectPage.connect({ canvas, applySettings, restart });
}

function applySettings(settings) {
  flockingSettings = { ...settings };
  showDistance = settings.showDistances;
  avoidWalls = settings.avoidWalls;
  onClickAction = settings.clickAction;
}

function applyBoidSettings(boid) {
  boid.external_control(flockingSettings.separation,
    flockingSettings.alignment,
    flockingSettings.cohesion,
    flockingSettings.mouseFollow,
    flockingSettings.obstacleAvoidance,
    flockingSettings.neighborDistance,
    flockingSettings.speed,
    showDistance,
    avoidWalls);
}

function restart(settings) {
  applySettings(settings);
  boids = [];
  chasers = [];
  obstacles = [];
  targetX = width / 2;
  targetY = height / 2;

  for (let i = 0; i < n_boids; i++) {
    boids[i] = new Boid(random(width), random(height));
    applyBoidSettings(boids[i]);
  }
  for (let i = 0; i < n_chasers; i++) {
    chasers[i] = new ChaserBoid(random(width), random(height));
  }
  for (let i = 0; i < n_obstacles; i++) {
    obstacles[i] = new Obstacle(random(width), random(height), random(10, 30));
  }
}

function draw() {
  background(50, 150, 255);
  for (let i = 0; i < boids.length; i++) {
    boids[i].update(boids, obstacles, i);
    applyBoidSettings(boids[i]);
  }
  for (let i = 0; i < chasers.length; i++) {
    chasers[i].update(chasers, obstacles, boids, i);
  }
  for (let obstacle of obstacles) {
    obstacle.display()
  }
  draw_support();
}

function draw_support() {
  fill(0);
  ellipse(targetX, targetY, 5, 5);
  fill(255);
  text("Boids on screen: " + boids.length, 30, 30)
  // ellipse(boids[0].pos.x, boids[0].pos.y, 5, 5);
  // textSize(32);
  fill(0);

}

// -------> support functions
function mousePressed(event) {
  if (!flockingSettings || event.target !== canvas.elt) {
    return;
  }
  if (onClickAction == 'Follow point') {
    if (onCanvas(mouseX, mouseY)) {
      targetX = mouseX;
      targetY = mouseY;
    }
  }
  if (onClickAction == 'Create boid') {
    if (onCanvas(mouseX, mouseY)) {
      const boid = new Boid(mouseX, mouseY);
      applyBoidSettings(boid);
      boids.push(boid);
    }
  }
  if (onClickAction == 'Create rock') {
    if (onCanvas(mouseX, mouseY)) {
      obstacles.push(new Obstacle(mouseX, mouseY, random(10, 30)));
    }
  }
  if (onClickAction == 'Create chaser') {
    if (onCanvas(mouseX, mouseY)) {
      chasers.push(new ChaserBoid(mouseX, mouseY));
    }
  }
  // Suppress compatibility mouse events after p5's touch-to-mouse fallback.
  return false;
}

function onCanvas(x, y) {
  if (x > 0 && x < width && y > 0 && y < height) {
    return true;
  }
  return false;
}
// <------- support functions


// -------> class definitions
class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.color = color(150, 50, 50);
  }
  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}

function ChaserBoid(x, y) {
  Boid.call(this, x, y);
  
  this.color = color(255, 100, 100, 255);
  this.color_alternative = color(255, 100, 100);
  this.targets = []
  this.chaseVector = createVector(0, 0);
  this.chaseCoefficient = 0.3;
  this.speed = 2.8;
  this.size = 30;

  this.update = function(boids, obstacles, targets, selfIndex) {
    this.get_neighbours(boids, selfIndex); // we check neighbours before moving
    this.get_targets(targets);
    this.avoidObstacles(obstacles)
    this.boid_behaviour();
    this.chase()
    this.move();
    this.display();
    this.set_defaults();
  }

  this.chase = function() {
    let leastDist = this.neighbourDistance;
    let closestTarget;
    let currentTargetDist;
    for (var i = 0; i < this.targets.length; i++) {
      currentTargetDist = this.pos.dist(this.targets[i].pos);
      if (currentTargetDist < leastDist) {
        leastDist = currentTargetDist;
        closestTarget = this.targets[i];
      }
    }
    if (closestTarget) {
      this.chaseVector = createVector(closestTarget.pos.x - this.pos.x,
        closestTarget.pos.y - this.pos.y).normalize();
      this.apply_acceleration(this.chaseVector, this.chaseCoefficient);
    }

  }

  this.get_targets = function(boids) {
    for (var i = 0; i < boids.length; i++) {
      if (this.neighbour_check(boids[i])) {
        this.targets.push(boids[i]);
      }
    }
  }
}


function Boid(x, y) {
  // behaviour constants
  this.separationCoefficient = 0.21;
  this.alignmentCoefficient = 0.5;
  this.cohesionCoefficient = 0.2;
  this.mouseCoefficient = 0.03;
  this.avoidWallCoefficient = 1;
  this.obstacleAvoidanceCoefficient = 0.2;
  this.neighbourDistance = 80;
  this.speed = 3;
  this.avoidWalls = 0;

  // vizualization constants
  this.size = 25;
  this.color = color(100, 255, 100, 50);
  this.color_alternative = color(100, 255, 100);
  this.showDistance = 0;

  this.pos = createVector(x, y);
  this.velocity = p5.Vector.random2D();
  this.acceleration = createVector(0, 0);
  this.separationVector = createVector(0, 0);
  this.alignmentVector = createVector(0, 0);
  this.cohesionVector = createVector(0, 0);
  this.angle = this.velocity.heading();
  this.neighbours = []

  this.external_control = function(separationCoefficient, alignmentCoefficient,
    cohesionCoefficient, mouseCoefficient, obstacleAvoidanceCoefficient,
    neighbourDistance, speed, showDistance, avoidWalls
  ) {
    this.separationCoefficient = separationCoefficient;
    this.alignmentCoefficient = alignmentCoefficient;
    this.cohesionCoefficient = cohesionCoefficient;
    this.mouseCoefficient = mouseCoefficient;
    this.obstacleAvoidanceCoefficient = obstacleAvoidanceCoefficient;
    this.neighbourDistance = neighbourDistance;
    this.speed = speed;
    this.showDistance = showDistance;
    this.avoidWalls = avoidWalls;
  }

  this.update = function(boids, obstacles, selfIndex) {
    this.get_neighbours(boids, selfIndex); // we check neighbours before moving
    this.avoidObstacles(obstacles)
    this.boid_behaviour();
    this.move();
    this.display();
    this.set_defaults();
  }

  this.boid_behaviour = function() {
    this.separation();
    this.alignment();
    this.cohesion();
    this.follow_mouse();
    if (this.avoidWalls) {
      this.avoidEdges()
    }
  }

  this.move = function() {
    this.velocity.add(this.acceleration);
    this.velocity.setMag(this.speed);
    this.pos.add(this.velocity);
    this.angle = this.velocity.heading();
    this.border_crossing_handling();
  }

  this.set_defaults = function() {
    this.acceleration.set(0, 0);
    // this.has_neighbour = false;
    this.neighbours = [];
    this.separationVector.set(0, 0);
    this.alignmentVector.set(0, 0);
    this.cohesionVector.set(0, 0);
  }

  this.apply_acceleration = function(directionVector, forceMagnitude) {
    this.acceleration.add(directionVector.copy().setMag(forceMagnitude));
  }

  this.follow_mouse = function() {
    let to_mouse = createVector(targetX - this.pos.x, targetY - this.pos.y);
    to_mouse.normalize()
    this.apply_acceleration(to_mouse, this.mouseCoefficient);
  }

  this.avoidObstacles = function(obstacles) {
    for (let obstacle of obstacles) {
      let distanceFromObstacle = this.pos.dist(obstacle.pos);
      if (distanceFromObstacle < obstacle.r * 2) {
        let avoidanceVector = createVector(this.pos.x - obstacle.pos.x,
          this.pos.y - obstacle.pos.y).normalize();

        this.apply_acceleration(avoidanceVector, this.obstacleAvoidanceCoefficient);
      }
    }
  }

  this.separation = function() {
    if (this.neighbours.length > 0) {
      let sum_x = 0
      let sum_y = 0
      for (var i = 0; i < this.neighbours.length; i++) {
        sum_x += this.neighbours[i].pos.x - this.pos.x;
        sum_y += this.neighbours[i].pos.y - this.pos.y;
      }
      this.separationVector = createVector(-1 * sum_x / this.neighbours.length,
        -1 * sum_y / this.neighbours.length).normalize();
      this.apply_acceleration(this.separationVector, this.separationCoefficient);
    }
  }

  this.alignment = function() {
    if (this.neighbours.length > 0) {
      let sum_x = 0
      let sum_y = 0
      for (var i = 0; i < this.neighbours.length; i++) {
        sum_x += this.neighbours[i].velocity.x
        sum_y += this.neighbours[i].velocity.y
      }
      this.alignmentVector = createVector(sum_x / this.neighbours.length,
        sum_y / this.neighbours.length).normalize();
      this.apply_acceleration(this.alignmentVector, this.alignmentCoefficient);
    }
  }

  this.cohesion = function() {
    if (this.neighbours.length > 0) {
      let sum_x = 0
      let sum_y = 0
      for (var i = 0; i < this.neighbours.length; i++) {
        sum_x += this.neighbours[i].pos.x
        sum_y += this.neighbours[i].pos.y
      }
      this.cohesionVector = createVector(sum_x / this.neighbours.length - this.pos.x,
        sum_y / this.neighbours.length - this.pos.y).normalize();
      this.apply_acceleration(this.cohesionVector, this.cohesionCoefficient);
    }
  }

  this.border_crossing_handling = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  this.avoidEdges = function() {
    var distanceToCheck = this.neighbourDistance;
    let desiredVector;
    if (width - this.pos.x < distanceToCheck) {
      this.AvoidWallCoefficient = 1 - (width - this.pos.x) / distanceToCheck;
      desiredVector = createVector(-width - this.pos.x, this.velocity.y);
      desiredVector.sub(this.velocity);
      this.apply_acceleration(desiredVector.normalize(),
        this.AvoidWallCoefficient);
    }
    if (this.pos.x < distanceToCheck) {
      this.AvoidWallCoefficient = 1 - (this.pos.x) / distanceToCheck;
      desiredVector = createVector(this.pos.x, this.velocity.y);
      desiredVector.sub(this.velocity);
      this.apply_acceleration(desiredVector.normalize(),
        this.AvoidWallCoefficient);
    }
    if (height - this.pos.y < distanceToCheck) {
      this.AvoidWallCoefficient = 1 - (height - this.pos.y) / distanceToCheck;
      desiredVector = createVector(this.velocity.x, -(height - this.pos.y));
      desiredVector.sub(this.velocity);
      this.apply_acceleration(desiredVector.normalize(),
        this.AvoidWallCoefficient);
    }
    if (this.pos.y < distanceToCheck) {
      this.AvoidWallCoefficient = 1 - (this.pos.y) / distanceToCheck;
      desiredVector = createVector(this.velocity.x, this.pos.y);
      desiredVector.sub(this.velocity);
      this.apply_acceleration(desiredVector.normalize(),
        this.AvoidWallCoefficient);
    }
  }

  this.neighbour_check = function(other) {
    return this.pos.dist(other.pos) < this.neighbourDistance;
  }

  this.get_neighbours = function(boids, selfIndex) {
    for (var i = 0; i < boids.length; i++) {
      if (i != selfIndex && this.neighbour_check(boids[i])) {
        this.neighbours.push(boids[i]);
      }
    }
  }

  this.display = function() {
    stroke(255);
    fill(this.color);
    if (this.neighbours.length > 0) {
      fill(this.color_alternative);
    } else {
      fill(this.color);
    }

    triangle_coordinates = this.calculate_triangle_points()
    triangle(triangle_coordinates.x1, triangle_coordinates.y1,
      triangle_coordinates.x2, triangle_coordinates.y2,
      triangle_coordinates.x3, triangle_coordinates.y3);

    if (this.showDistance) {
      noFill();
      ellipse(triangle_coordinates.x1, triangle_coordinates.y1,
        this.neighbourDistance, this.neighbourDistance) // if circles touch, means they are close!
    }

  }

  this.calculate_triangle_points = function() {
    offset = 0.2
    x2 = this.pos.x - this.size * cos(this.angle + offset)
    y2 = this.pos.y - this.size * sin(this.angle + offset)
    x3 = this.pos.x - this.size * cos(this.angle - offset)
    y3 = this.pos.y - this.size * sin(this.angle - offset)
    return {
      x1: this.pos.x,
      y1: this.pos.y,
      x2: x2,
      y2: y2,
      x3: x3,
      y3: y3
    }
  }
}