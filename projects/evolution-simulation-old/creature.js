class Creature {
  constructor(pos, size, settings) {
    this.settings = settings;
    this.properties = settings.simulation.creatureProperties;
    this.transform = new Transform(pos, size);
    this.mover = new Mover(this);
    this.eyesight = new Eyesight(this);
    this.color = color(100, 255, 100);

    // modifiers
    this.avoidanceMode = 0;
    this.directControlled = 1;
  }

  update() {
    // ez majd a behav komponensbe kell kerüljön
    if (this.avoidanceMode == 0) {
      // ezt majd töröld, direktbe ilyen ne legyen
      // this.mover.wander();
      if (mouseIsPressed) {
        this.mover.seek(createVector(mouseX, mouseY));
      } else if (this.directControlled) {
        
      } else {
        this.mover.wander();
      }
    }

    this.mover.move();

    this.eyesight.update();
    this.avoidanceMode = 0;
  }

  handleObstacles(obstacles) {
    for (let obstacle of obstacles) {
      let facedSide = obstacle.returnFacedSide(this.transform.pos, false);
      let projectedPosOnSide = Utils.vectorProjection(this.transform.pos,
                                                      facedSide[0],
                                                      facedSide[1]);
      if (obstacle.onIt(this.transform.pos)) {
        // if creature is on obstacle, teleport it to the closest edge
        this.mover.teleport(projectedPosOnSide, true);
      }
    }
    // check if creature sees any of the obstacles (only the closest returned)
    let hit = this.eyesight.isSeenByRay(
      obstacles,
      false,
      true
    );
    if (hit) {
      let obstacle = hit.obstacle;
      let facedSide = obstacle.returnFacedSide(this.transform.pos, false);
      let projectedPosOnSide = Utils.vectorProjection(
        this.transform.pos,
        facedSide[0],
        facedSide[1]
      );
      this.avoidanceMode = 1;
      this.mover.avoidSegment(facedSide[0], facedSide[1], 1);
    }
  }

  display() {
    let triangleCoordinates = Utils.calculateTrianglePoints(
      this.transform.pos,
      this.transform.size,
      this.transform.angle,
      0.3
    );
    push();
    noStroke();
    fill(this.color);
    triangle(
      triangleCoordinates.x1,
      triangleCoordinates.y1,
      triangleCoordinates.x2,
      triangleCoordinates.y2,
      triangleCoordinates.x3,
      triangleCoordinates.y3
    );

    this.eyesight.display();
    pop();
  }
}
