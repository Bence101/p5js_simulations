"use strict";

let simulation;
let cameraY = CAMERA_DEFAULTS.cameraY;
let zoomScale = CAMERA_DEFAULTS.zoomScale;
let minZoom = 0.1 * SCALE_INITIAL;
let maxZoom = 10 * SCALE_INITIAL;
let offsetX = CAMERA_DEFAULTS.offsetX;
let offsetY = CAMERA_DEFAULTS.offsetY;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let collisionCount = 0;
let vehicleCountElement;
let collisionCountElement;

function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("sketch");

  Config.vehicle.car.color = color(0, 0, 255);
  Config.vehicle.truck.color = color(150, 75, 0);
  Config.colors = [
    color(200, 0, 0),
    color(0, 200, 0),
    color(0, 0, 255),
    color(200, 200, 0),
    color(0, 200, 255),
    color(200, 0, 255),
  ];

  vehicleCountElement = document.getElementById("vehicle-count");
  collisionCountElement = document.getElementById("collision-count");
  if (
    !(vehicleCountElement instanceof HTMLOutputElement) ||
    !(collisionCountElement instanceof HTMLOutputElement)
  ) {
    throw new Error("Traffic simulation readouts are missing from the project page.");
  }

  simulation = new Simulation();
  ProjectPage.connect({
    canvas,
    defaults: {},
    applySettings(settings) {
      assertEmptySettings(settings);
    },
    restart(settings) {
      assertEmptySettings(settings);
      restartSimulation();
    },
    reset(settings) {
      assertEmptySettings(settings);
      resetCamera();
      restartSimulation();
    },
  });
}

function draw() {
  background(220);
  push();
  translate(offsetX, offsetY);
  scale(zoomScale);
  simulation.update();
  simulation.display();
  pop();
  updateInfoPanel();
}

function mouseWheel(event) {
  const zoomFactor = 0.001;
  let newZoomScale = zoomScale - event.delta * zoomFactor * zoomScale;
  newZoomScale = constrain(newZoomScale, minZoom, maxZoom);

  const worldX = (mouseX - offsetX) / zoomScale;
  const worldY = (mouseY - offsetY) / zoomScale;
  offsetX -= worldX * (newZoomScale - zoomScale);
  offsetY -= worldY * (newZoomScale - zoomScale);
  zoomScale = newZoomScale;
  return false;
}

function mousePressed() {
  if (mouseButton === LEFT) {
    const worldX = (mouseX - offsetX) / zoomScale;
    const worldY = (mouseY - offsetY) / zoomScale;

    if (simulation.isPointOnRoad(worldX, worldY)) {
      simulation.addVehicleAtPosition(worldX, worldY);
    } else {
      isDragging = true;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    offsetX += dx;
    offsetY += dy;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function restartSimulation() {
  collisionCount = 0;
  simulation = new Simulation();
  updateInfoPanel();
}

function resetCamera() {
  cameraY = CAMERA_DEFAULTS.cameraY;
  zoomScale = CAMERA_DEFAULTS.zoomScale;
  offsetX = CAMERA_DEFAULTS.offsetX;
  offsetY = CAMERA_DEFAULTS.offsetY;
  isDragging = false;
}

function assertEmptySettings(settings) {
  if (
    settings === null ||
    typeof settings !== "object" ||
    Array.isArray(settings) ||
    Object.keys(settings).length !== 0
  ) {
    throw new Error("Traffic Jam Simulator does not support adjustable settings.");
  }
}

function updateInfoPanel() {
  vehicleCountElement.textContent = String(simulation.vehicles.length);
  collisionCountElement.textContent = String(collisionCount);
}
