"use strict";

class Vehicle {
  constructor(lane, distance, velocity) {
    this.lane = lane;
    this.distance = distance;
    this.velocity = velocity;
    this.desiredVelocity = velocity;
    this.acceleration = 0;
    this.maxAcceleration = 2;
    this.maxDeceleration = 2;
    this.length = 4;
    this.width = 1.8;
    this.color = Utils.assignRandomColor();
    this.isColliding = false;
    this.collisionTime = 0;
  }

  update() {
    this.applyMotion();
    this.acceleration = 0;
  }

  applyActions(actions) {
    if (actions.decelerate > 0) {
      this.decelerate(actions.decelerate);
    } else if (actions.accelerate > 0) {
      this.accelerate(actions.accelerate);
    }

    if (actions.changeLane !== 0) {
      this.changeLane(actions.changeLane);
    }
  }

  applyMotion() {
    const timeStep = deltaTime / 1000;
    this.velocity += this.acceleration * timeStep;
    this.velocity = max(0, this.velocity);
    this.distance += this.velocity * timeStep;
  }

  accelerate(rate) {
    this.acceleration += this.maxAcceleration * rate;
    this.acceleration = min(this.maxAcceleration, this.acceleration);
  }

  decelerate(rate) {
    this.acceleration -= this.maxDeceleration * rate;
    this.acceleration = max(-this.maxDeceleration, this.acceleration);
  }

  changeLane(direction) {
    const newLane = this.lane + direction;
    if (newLane >= 0 && newLane < Config.road.nLanes) {
      this.lane = newLane;
    }
  }

  display(road) {
    const x = road.getXFromLane(this.lane);
    const y = road.getYFromDistance(this.distance);
    const screenX = x * zoomScale + offsetX;
    const screenY = y * zoomScale + offsetY;
    if (
      screenX > -50 &&
      screenX < width + 50 &&
      screenY > -50 &&
      screenY < height + 50
    ) {
      this.drawVehicle(x, y);
    }
  }

  drawVehicle(x, y) {
    const w = this.width;
    const length = this.length;

    push();
    translate(x, y);
    rotate(HALF_PI);

    if (this.isColliding) {
      stroke(255, 0, 0);
      strokeWeight(2 / zoomScale);
    } else {
      noStroke();
    }

    fill(this.color);
    beginShape();
    vertex(-length / 2, -w / 2);
    vertex(length / 2, -w / 2);
    bezierVertex(
      length / 2 + length / 10,
      -w / 3,
      length / 2 + length / 10,
      w / 3,
      length / 2,
      w / 2
    );
    vertex(-length / 2, w / 2);
    bezierVertex(
      -length / 2 - length / 6,
      w / 3,
      -length / 2 - length / 6,
      -w / 3,
      -length / 2,
      -w / 2
    );
    endShape(CLOSE);

    fill(200, 200, 255);
    rectMode(CENTER);
    rect(0, 0, length / 2, w / 2);
    fill(0);
    ellipse(-length / 4, -w / 2, w / 5, w / 5);
    ellipse(length / 4, -w / 2, w / 5, w / 5);
    ellipse(-length / 4, w / 2, w / 5, w / 5);
    ellipse(length / 4, w / 2, w / 5, w / 5);
    pop();
  }
}

class Car extends Vehicle {
  constructor(lane, distance, velocity) {
    super(lane, distance, velocity);
    const carConfig = Config.vehicle.car;
    this.maxAcceleration = carConfig.maxAcceleration;
    this.maxDeceleration = carConfig.maxDeceleration;
    this.length = carConfig.length;
    this.width = carConfig.width;
    this.desiredVelocity = carConfig.desiredVelocity;
    this.color = carConfig.color;
  }
}

class Truck extends Vehicle {
  constructor(lane, distance, velocity) {
    super(lane, distance, velocity);
    const truckConfig = Config.vehicle.truck;
    this.maxAcceleration = truckConfig.maxAcceleration;
    this.maxDeceleration = truckConfig.maxDeceleration;
    this.length = truckConfig.length;
    this.width = truckConfig.width;
    this.desiredVelocity = truckConfig.desiredVelocity;
    this.color = truckConfig.color;
  }

  drawVehicle(x, y) {
    const w = this.width;
    const length = this.length;

    push();
    translate(x, y);
    rotate(HALF_PI);

    if (this.isColliding) {
      stroke(255, 0, 0);
      strokeWeight(2 / zoomScale);
    } else {
      noStroke();
    }

    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, length, w);
    fill(0);
    ellipse(-length / 3, -w / 2, w / 4, w / 4);
    ellipse(length / 3, -w / 2, w / 4, w / 4);
    ellipse(-length / 3, w / 2, w / 4, w / 4);
    ellipse(length / 3, w / 2, w / 4, w / 4);
    pop();
  }
}

class VehicleSensor {
  constructor(vehicle, vehicles, road) {
    this.vehicle = vehicle;
    this.vehicles = vehicles;
    this.road = road;
  }

  perceive() {
    return {
      sameLaneVehicles: Utils.getVehiclesInLane(
        this.vehicle,
        this.vehicles,
        this.vehicle.lane,
        this.road
      ),
      leftLaneVehicles: Utils.getVehiclesInLane(
        this.vehicle,
        this.vehicles,
        this.vehicle.lane - 1,
        this.road
      ),
      rightLaneVehicles: Utils.getVehiclesInLane(
        this.vehicle,
        this.vehicles,
        this.vehicle.lane + 1,
        this.road
      ),
    };
  }
}

class VehicleBehavior {
  constructor(vehicle) {
    this.vehicle = vehicle;
  }

  decide(perception) {
    const actions = {
      accelerate: 0,
      decelerate: 0,
      changeLane: 0,
    };

    const vehicleAhead = Utils.getClosestVehicleAhead(
      this.vehicle,
      perception.sameLaneVehicles
    );

    if (vehicleAhead) {
      const distanceToVehicle = vehicleAhead.distance - this.vehicle.distance;
      const safeDistance =
        this.vehicle.velocity * 2 +
        (this.vehicle.length + vehicleAhead.length) / 2;

      if (distanceToVehicle < safeDistance) {
        actions.decelerate = min(
          1,
          (safeDistance - distanceToVehicle) / safeDistance
        );
      }
    } else if (this.vehicle.velocity < this.vehicle.desiredVelocity) {
      actions.accelerate = 0.5;
    }

    // Future idea: implement lane-changing behavior.
    return actions;
  }
}
