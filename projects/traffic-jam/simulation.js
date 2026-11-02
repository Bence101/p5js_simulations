"use strict";

class Simulation {
  constructor() {
    this.initializeRoad();
    this.initializeVehicles();
    this.vehicleAddCooldownTime = 0;
    this.collisions = [];
  }

  initializeRoad() {
    this.road = new Road(createVector(0, 0));
  }

  initializeVehicles() {
    this.vehicles = [];
    let attempts = 0;
    while (
      this.vehicles.length < Config.simulation.initialVehicleCount &&
      attempts < 1000
    ) {
      attempts++;
      const lane = floor(random(0, this.road.nLanes));
      const distance = random(0, this.road.h);
      const velocity = random(10, 25);
      let vehicle;
      if (random() < 0.2) {
        vehicle = new Truck(lane, distance, velocity);
      } else {
        vehicle = new Car(lane, distance, velocity);
      }
      if (!Utils.checkOverlap(vehicle, this.vehicles)) {
        this.vehicles.push(vehicle);
      }
    }
  }

  addRandomVehicle() {
    const lane = floor(random(0, this.road.nLanes));
    const distance = 0;
    const velocity = random(10, 25);
    let vehicle;
    if (random() < 0.2) {
      vehicle = new Truck(lane, distance, velocity);
    } else {
      vehicle = new Car(lane, distance, velocity);
    }
    if (!Utils.checkOverlap(vehicle, this.vehicles)) {
      this.vehicles.push(vehicle);
    }
  }

  addVehicleAtPosition(x, y) {
    const lane = this.road.getLaneFromX(x);
    if (lane !== -1) {
      const distance = this.road.h - (y + cameraY);
      const velocity = random(10, 25);
      let vehicle;
      if (random() < 0.2) {
        vehicle = new Truck(lane, distance, velocity);
      } else {
        vehicle = new Car(lane, distance, velocity);
      }
      if (!Utils.checkOverlap(vehicle, this.vehicles)) {
        this.vehicles.push(vehicle);
      }
    }
  }

  isPointOnRoad(x, y) {
    const onX = x >= this.road.pos.x && x <= this.road.pos.x + this.road.w;
    const onY =
      y >= this.road.pos.y - cameraY &&
      y <= this.road.pos.y + this.road.h - cameraY;
    return onX && onY;
  }

  update() {
    this.updateVehicles();
    this.checkCollisions();
    this.handleCollisions();
    this.removeOffscreenVehicles();
    this.handleVehicleSpawning();
  }

  updateVehicles() {
    const perceptions = this.vehicles.map((vehicle) => {
      const sensor = new VehicleSensor(vehicle, this.vehicles, this.road);
      return sensor.perceive();
    });

    const actionsList = this.vehicles.map((vehicle, index) => {
      const behavior = new VehicleBehavior(vehicle);
      return behavior.decide(perceptions[index]);
    });

    this.vehicles.forEach((vehicle, index) => {
      if (!vehicle.isColliding) {
        vehicle.applyActions(actionsList[index]);
      }
      vehicle.update();
    });
  }

  checkCollisions() {
    const collisionPairs = [];
    for (let i = 0; i < this.vehicles.length; i++) {
      const vehicle = this.vehicles[i];
      if (vehicle.isColliding) continue;
      for (let j = i + 1; j < this.vehicles.length; j++) {
        const otherVehicle = this.vehicles[j];
        if (otherVehicle.isColliding) continue;
        if (vehicle.lane === otherVehicle.lane) {
          const distanceBetween = abs(vehicle.distance - otherVehicle.distance);
          const minDistance = (vehicle.length + otherVehicle.length) / 2;
          if (distanceBetween < minDistance) {
            collisionPairs.push([vehicle, otherVehicle]);
          }
        }
      }
    }

    for (const [vehicle, otherVehicle] of collisionPairs) {
      vehicle.isColliding = true;
      otherVehicle.isColliding = true;
      vehicle.collisionTime = millis();
      otherVehicle.collisionTime = millis();
      collisionCount++;
    }
  }

  handleCollisions() {
    const currentTime = millis();
    this.vehicles = this.vehicles.filter((vehicle) => {
      if (vehicle.isColliding) {
        if (currentTime - vehicle.collisionTime > 2000) {
          return false;
        }
        vehicle.velocity = 0;
      }
      return true;
    });
  }

  removeOffscreenVehicles() {
    this.vehicles = this.vehicles.filter(
      (vehicle) =>
        vehicle.distance >= 0 &&
        vehicle.distance <= this.road.h &&
        vehicle.lane >= 0 &&
        vehicle.lane < this.road.nLanes
    );
  }

  handleVehicleSpawning() {
    if (this.vehicleAddCooldownTime <= 0) {
      this.addRandomVehicle();
      const spawnRate = random(
        Config.simulation.vehicleSpawnRate.min,
        Config.simulation.vehicleSpawnRate.max
      );
      this.vehicleAddCooldownTime = spawnRate;
    }
    this.vehicleAddCooldownTime -= deltaTime / 1000;
  }

  display() {
    this.road.display();
    for (const vehicle of this.vehicles) {
      vehicle.display(this.road);
    }
  }
}
