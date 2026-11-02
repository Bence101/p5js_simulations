"use strict";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Config = {
  simulation: {
    timeStep: 1 / 60,
    vehicleSpawnRate: { min: 1, max: 3 },
    initialVehicleCount: 120,
    safeDistance: 10,
  },
  vehicle: {
    car: {
      maxAcceleration: 3,
      maxDeceleration: 10,
      length: 4,
      width: 1.8,
      desiredVelocity: 20,
    },
    truck: {
      maxAcceleration: 2,
      maxDeceleration: 6,
      length: 12,
      width: 2.5,
      desiredVelocity: 15,
    },
  },
  road: {
    laneWidth: 3.7,
    nLanes: 10,
    length: 300,
  },
  scaling: {
    scale: 3,
  },
};

const SCALE_INITIAL = Config.scaling.scale;
const CAMERA_DEFAULTS = {
  cameraY: 0,
  zoomScale: SCALE_INITIAL,
  offsetX: 0,
  offsetY: 0,
};
