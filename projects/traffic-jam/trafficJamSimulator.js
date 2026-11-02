// trafficJamSimulator.js

/* -------------------- Konfigurációs objektum -------------------- */

const Config = {
  simulation: {
    timeStep: 1 / 60, // másodperc
    vehicleSpawnRate: { min: 1, max: 3 }, // másodperc
    initialVehicleCount: 120, // Inicializálandó járművek száma
    safeDistance: 10, // méter, minimális távolság a járművek között
  },
  vehicle: {
    car: {
      maxAcceleration: 3, // m/s²
      maxDeceleration: 10, // m/s²
      length: 4, // méter
      width: 1.8, // méter
      desiredVelocity: 20, // m/s
      // A színt a setup-ban állítjuk be
    },
    truck: {
      maxAcceleration: 2, // m/s²
      maxDeceleration: 6, // m/s²
      length: 12, // méter
      width: 2.5, // méter
      desiredVelocity: 15, // m/s
      // A színt a setup-ban állítjuk be
    },
  },
  road: {
    laneWidth: 3.7, // méter
    nLanes: 10,
    length: 300, // méter
  },
  scaling: {
    scale: 3, // pixel per méter (kezdeti skála)
  },
};

/* -------------------- Konstansok -------------------- */

const SCALE_INITIAL = Config.scaling.scale;

/* -------------------- Utils osztály -------------------- */

class Utils {
  static assignRandomColor() {
    return random(Utils.colors);
  }

  static getClosestVehicleAhead(currentVehicle, vehicles) {
    const vehiclesAhead = vehicles.filter(
      (v) =>
        v.distance > currentVehicle.distance &&
        v.lane === currentVehicle.lane
    );
    if (vehiclesAhead.length > 0) {
      return vehiclesAhead.reduce((closest, v) =>
        v.distance < closest.distance ? v : closest
      );
    }
    return null;
  }

  static getVehiclesInLane(vehicle, vehicles, lane, road) {
    if (lane < 0 || lane >= road.nLanes) {
      return [];
    }
    return vehicles.filter((v) => v.lane === lane && v !== vehicle);
  }

  static checkOverlap(newVehicle, vehicles) {
    const safeDistance = Config.simulation.safeDistance;
    for (let vehicle of vehicles) {
      if (
        vehicle.lane === newVehicle.lane &&
        abs(vehicle.distance - newVehicle.distance) <
          (vehicle.length + newVehicle.length) / 2 + safeDistance
      ) {
        return true; // Átfedés van egy meglévő járművel
      }
    }
    return false; // Nincs átfedés
  }
}

/* -------------------- Globális változók -------------------- */

let simulation;
let cameraY = 0; // méterben
let zoomScale = SCALE_INITIAL; // Aktuális zoom szint
let minZoom = 0.1 * SCALE_INITIAL;
let maxZoom = 10 * SCALE_INITIAL;
let offsetX = 0; // Panning offset X (pixelekben)
let offsetY = 0; // Panning offset Y (pixelekben)
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

let collisionCount = 0;

/* -------------------- Setup és Draw függvények -------------------- */

function setup() {
  const canvas = createCanvas(800, 600);
  // canvas.parent('canvas-container'); // Eltávolítva, mivel nincs ilyen elem

  // Színek beállítása a p5.js 'color' függvényével
  Config.vehicle.car.color = color(0, 0, 255);
  Config.vehicle.truck.color = color(150, 75, 0);

  Utils.colors = [
    color(200, 0, 0),
    color(0, 200, 0),
    color(0, 0, 255),
    color(200, 200, 0),
    color(0, 200, 255),
    color(200, 0, 255),
  ];

  simulation = new Simulation();
}

function draw() {
  background(220);

  // Zoom és panning transzformációk alkalmazása
  push();
  translate(offsetX, offsetY);
  scale(zoomScale);

  simulation.update();
  simulation.display();

  pop();

  // Információs panel frissítése
  updateInfoPanel();
}

/* -------------------- Egér interakciós függvények -------------------- */

function mouseWheel(event) {
  // Zoom beállítása
  const zoomFactor = 0.001;
  let newZoomScale = zoomScale - event.delta * zoomFactor * zoomScale;
  newZoomScale = constrain(newZoomScale, minZoom, maxZoom);

  // Zoom középpontjának beállítása az egér pozíciója alapján
  const wx = (mouseX - offsetX) / zoomScale;
  const wy = (mouseY - offsetY) / zoomScale;

  // Offset módosítása a zoom középpontjának megtartásához
  offsetX -= wx * (newZoomScale - zoomScale);
  offsetY -= wy * (newZoomScale - zoomScale);

  zoomScale = newZoomScale;

  // Alapértelmezett görgetés megakadályozása
  return false;
}

function mousePressed() {
  if (mouseButton === LEFT) {
    // Ellenőrizzük, hogy az útra kattintott-e
    const wx = (mouseX - offsetX) / zoomScale;
    const wy = (mouseY - offsetY) / zoomScale;

    if (simulation.isPointOnRoad(wx, wy)) {
      simulation.addVehicleAtPosition(wx, wy);
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
    // Egér mozgásának kiszámítása
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;

    // Offset frissítése a panninghez
    offsetX += dx;
    offsetY += dy;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

/* -------------------- Road osztály -------------------- */

class Road {
  constructor(pos) {
    this.nLanes = Config.road.nLanes;
    this.laneWidth = Config.road.laneWidth;
    this.w = this.nLanes * this.laneWidth;
    this.h = Config.road.length;
    this.pos = pos;
    this.color = [50, 50, 50]; // Sötétszürke aszfalthoz
  }

  getYFromDistance(distance) {
    return this.pos.y + this.h - distance - cameraY;
  }

  getXFromLane(lane) {
    return this.pos.x + this.laneWidth * lane + this.laneWidth / 2;
  }

  getLaneFromX(x) {
    const relativeX = x - this.pos.x;
    if (relativeX < 0 || relativeX > this.w) {
      return -1;
    }
    return floor(relativeX / this.laneWidth);
  }

  display() {
    push();
    noStroke();
    fill(this.color);
    rect(this.pos.x, this.pos.y - cameraY, this.w, this.h);
    this.displayLaneStripes();
    pop();
  }

  displayLaneStripes() {
    push();
    stroke(255); // Fehér sávjelzések
    strokeWeight(1 / zoomScale); // Stroke vastagság igazítása a zoomhoz
    drawingContext.setLineDash([
      15 / zoomScale,
      10 / zoomScale,
    ]); // Vonal mintázat igazítása a zoomhoz
    for (let i = 1; i < this.nLanes; i++) {
      const x = this.pos.x + i * this.laneWidth;
      line(x, this.pos.y - cameraY, x, this.pos.y + this.h - cameraY);
    }
    drawingContext.setLineDash([]); // Vonal mintázat visszaállítása
    pop();
  }
}

/* -------------------- Vehicle osztályok -------------------- */

class Vehicle {
  constructor(lane, distance, velocity) {
    this.lane = lane;
    this.distance = distance; // méterben
    this.velocity = velocity; // m/s
    this.desiredVelocity = velocity;
    this.acceleration = 0;

    // Alapértelmezett tulajdonságok (felülírható)
    this.maxAcceleration = 2; // m/s²
    this.maxDeceleration = 2; // m/s²
    this.length = 4; // méter
    this.width = 1.8; // méter
    this.color = Utils.assignRandomColor();
    this.isColliding = false;
    this.collisionTime = 0;
  }

  update() {
    // Mozgás alkalmazása
    this.applyMotion();
    // Gyorsulás alaphelyzetbe állítása
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
    const timeStep = deltaTime / 1000; // Másodpercekben
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

    // Csak akkor rajzoljuk, ha a nézetben van
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
    const l = this.length;

    push();
    translate(x, y);
    rotate(HALF_PI);

    // Jármű test
    if (this.isColliding) {
      stroke(255, 0, 0); // Piros keret ütközés esetén
      strokeWeight(2 / zoomScale);
    } else {
      noStroke();
    }

    fill(this.color);
    beginShape();
    vertex(-l / 2, -w / 2);
    vertex(l / 2, -w / 2);
    bezierVertex(
      l / 2 + l / 10,
      -w / 3,
      l / 2 + l / 10,
      w / 3,
      l / 2,
      w / 2
    );
    vertex(-l / 2, w / 2);
    bezierVertex(
      -l / 2 - l / 6,
      w / 3,
      -l / 2 - l / 6,
      -w / 3,
      -l / 2,
      -w / 2
    );
    endShape(CLOSE);

    // Ablakok
    fill(200, 200, 255);
    rectMode(CENTER);
    rect(0, 0, l / 2, w / 2);

    // Kerekek
    fill(0);
    ellipse(-l / 4, -w / 2, w / 5, w / 5);
    ellipse(l / 4, -w / 2, w / 5, w / 5);
    ellipse(-l / 4, w / 2, w / 5, w / 5);
    ellipse(l / 4, w / 2, w / 5, w / 5);

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
    const l = this.length;

    push();
    translate(x, y);
    rotate(HALF_PI);

    // Teherautó test
    if (this.isColliding) {
      stroke(255, 0, 0); // Piros keret ütközés esetén
      strokeWeight(2 / zoomScale);
    } else {
      noStroke();
    }

    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, l, w);

    // Kerekek
    fill(0);
    ellipse(-l / 3, -w / 2, w / 4, w / 4);
    ellipse(l / 3, -w / 2, w / 4, w / 4);
    ellipse(-l / 3, w / 2, w / 4, w / 4);
    ellipse(l / 3, w / 2, w / 4, w / 4);

    pop();
  }
}

/* -------------------- VehicleSensor osztály -------------------- */

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

/* -------------------- VehicleBehavior osztály -------------------- */

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
        (this.vehicle.length + vehicleAhead.length) / 2; // Járművek hossza figyelembe véve

      if (distanceToVehicle < safeDistance) {
        actions.decelerate = min(
          1,
          (safeDistance - distanceToVehicle) / safeDistance
        );
      }
    } else {
      // Nincs jármű előtte; gyorsítás a kívánt sebességre
      if (this.vehicle.velocity < this.vehicle.desiredVelocity) {
        actions.accelerate = 0.5;
      }
    }

    // Jövőbeli fejlesztés: Sávváltási logika implementálása

    return actions;
  }
}

/* -------------------- Simulation osztály -------------------- */

class Simulation {
  constructor() {
    this.initializeRoad();
    this.initializeVehicles();
    this.vehicleAddCooldownTime = 0;
    this.collisions = []; // Ütközések nyilvántartása
  }

  initializeRoad() {
    this.road = new Road(createVector(0, 0));
  }

  initializeVehicles() {
    this.vehicles = [];
    // Járművek létrehozása az út teljes hosszán
    let attempts = 0;
    while (
      this.vehicles.length < Config.simulation.initialVehicleCount &&
      attempts < 1000
    ) {
      attempts++;
      const lane = floor(random(0, this.road.nLanes));
      const distance = random(0, this.road.h);
      const velocity = random(10, 25); // m/s
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
    const distance = 0; // Az út elején jelenik meg
    const velocity = random(10, 25); // m/s
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
      const velocity = random(10, 25); // m/s
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
    // A cameraY frissítésére nincs szükség, mivel a panning felhasználó által vezérelt
  }

  updateVehicles() {
    // Érzékelés fázis
    const perceptions = this.vehicles.map((vehicle) => {
      const sensor = new VehicleSensor(vehicle, this.vehicles, this.road);
      return sensor.perceive();
    });

    // Döntéshozatal fázis
    const actionsList = this.vehicles.map((vehicle, index) => {
      const behavior = new VehicleBehavior(vehicle);
      return behavior.decide(perceptions[index]);
    });

    // Akció és mozgás fázis
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
      const v1 = this.vehicles[i];
      if (v1.isColliding) continue; // Már ütközésben van
      for (let j = i + 1; j < this.vehicles.length; j++) {
        const v2 = this.vehicles[j];
        if (v2.isColliding) continue; // Már ütközésben van
        if (v1.lane === v2.lane) {
          const distanceBetween = abs(v1.distance - v2.distance);
          const minDistance = (v1.length + v2.length) / 2; // Téglalap alakú járművek
          if (distanceBetween < minDistance) {
            collisionPairs.push([v1, v2]);
          }
        }
      }
    }

    // Ütközések kezelése
    for (let pair of collisionPairs) {
      const [v1, v2] = pair;
      v1.isColliding = true;
      v2.isColliding = true;
      v1.collisionTime = millis();
      v2.collisionTime = millis();
      collisionCount++;
    }
  }

  handleCollisions() {
    const currentTime = millis();
    this.vehicles = this.vehicles.filter((vehicle) => {
      if (vehicle.isColliding) {
        if (currentTime - vehicle.collisionTime > 2000) {
          // Jármű eltávolítása 2 másodperc után
          return false;
        } else {
          // Jármű megállítása ütközés alatt
          vehicle.velocity = 0;
        }
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
    this.vehicleAddCooldownTime -= deltaTime / 1000; // Másodpercekben
  }

  display() {
    this.road.display();
    for (let vehicle of this.vehicles) {
      vehicle.display(this.road);
    }
  }
}

/* -------------------- Információs panel frissítése -------------------- */

function updateInfoPanel() {
  const vehicleCountElement = document.getElementById('vehicle-count');
  const collisionCountElement = document.getElementById('collision-count');

  vehicleCountElement.textContent = `Járművek az úton: ${simulation.vehicles.length}`;
  collisionCountElement.textContent = `Ütközések száma: ${collisionCount}`;
}
