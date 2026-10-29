class Car {
  constructor(pos, heading, brainNN) {
    this.pos = pos.copy(); // center!
    this.width = carWidth;
    this.height = carHeight;
    this.minSpeed = carMinSpeed; // no reverse or stop
    this.directSteeringSpeed = carDirectSteeringSpeed;
    this.directSpeedChangeMagnitude = carDirectSpeedChangeMagnitude;
    this.maxSpeed = carNaxSpeed;

        
    this.speed = this.minSpeed;
    this.heading = heading;
    this.vel = p5.Vector.fromAngle(this.heading, this.speed);


    this.setCornerPoints(-5); // this tighten the collision box, not necessary
    this.polyCollider = new PolyCollider(this.cornerPoints);
    let angles = [0, PI/4, PI/2, PI, -PI/2, -PI/4]
    this.radarLenght = this.width * 2
    this.radarCollider = new radarCollider(this.pos, this.heading, 
                                           angles, this.radarLenght);

    this.brain = new Brain(brainNN);

    this.isAlive = 1;
    this.image = carPicture.get();
    this.fitness = 0;
    this.score = 0;
    this.finished = 0;
    
    this.sumSpeed = 0;
    this.cntFrames = 0;
    
    this.text = ''
  }

  update(track) {
    if ((!this.isAlive) || (this.finished)) {return}
    this.checkForCollision(track);
    this.detectWalls(track);
    this.checkForCheckpoints(track);

    
    this.control();
    this.controlByBrain();                                             
    this.vel = p5.Vector.fromAngle(this.heading, this.speed);
    this.pos.add(this.vel);
    this.setCornerPoints(-5);
    this.updatePolyCollider(this.cornerPoints);
    this.radarCollider.update(this.pos, this.heading);
    this.sumSpeed += this.speed;
    this.cntFrames++;
  }

  directSteering(direction) {
    if (this.speed) {
      this.heading += direction * this.directSteeringSpeed;
    }
  }

  directSpeedChange(direction) {
    this.speed += direction * this.directSpeedChangeMagnitude;
    this.speed = max(this.minSpeed, min(this.speed, this.maxSpeed));
  }
  
  controlByBrain() {
    let radarDistances = []
    for (let detection of this.detections) {
      if (detection) {
        radarDistances.push(this.pos.dist(detection))
      } else {
        radarDistances.push(this.radarLenght)
      }
    }

    let prediction = this.brain.nn.predict(radarDistances);
    let largestOutput = prediction.reduce((iMax, x, i, arr) => x > 
                                          arr[iMax] ? i : iMax, 0);
    
    if (largestOutput == 0) {
      this.directSteering(-1);
    }
    if (largestOutput == 1) {
      this.directSteering(1);
    }
    if (largestOutput == 2) {
      this.directSpeedChange(1);
    }
    if (largestOutput == 3) {
      this.directSpeedChange(-1);
    }
  }

  control() {
    // ezt kell kicserélni, hogy az 'agynak' megfelelően irányítson
    if (keyIsDown(LEFT_ARROW)) {
      this.directSteering(-1);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.directSteering(1);
    }
    if (keyIsDown(UP_ARROW)) {

      this.directSpeedChange(1);
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.directSpeedChange(-1);
    }
    if (keyIsDown(32)) {
      this.speed = 0;
    }
  }

    
  checkForCheckpoints(object) {
    // IDE JÖHET EGY FINISH LOGIKA
    let checkpoints = object.checkpoints;
    let headPoint = p5.Vector.fromAngle(this.heading, 20);
    headPoint.add(this.pos);
    if (!this.nextCheckpointCenter) {
      this.nextCheckpointCenter = checkpoints[0].center;
    }
    
    for (let i = 0; i < checkpoints.length; i++) {
      let checkpoint = checkpoints[i];
      let tmpChekpointIntersection = Utils.segmentIntersection(checkpoint.start,
                                                            checkpoint.end,
                                                            this.pos, headPoint)
      if (tmpChekpointIntersection) {
        if (checkpoint.num == this.score + 1) {
          this.lastChekpointIntersection = tmpChekpointIntersection.copy();
          // ez hibára fog futni, ha kifogyunk a checkpointokból!
          if (i+1 < checkpoints.length) {
            this.nextCheckpointCenter = checkpoints[i + 1].center;
          }
          this.score = checkpoint.num;
          if (this.score == object.checkpoints.length) {
            this.finished = 1;
          }
        }
      }
    }
  }
    
  calculateFitness() {
    // az alap pontot az elért checkpointok száma adja
    // erre rájön még a partialFitness ami nagyjából arányosan ad pontot az utolsó és a következő checkpoint közötti távolság alapján (minél többet tesz meg annál többet)
      // a partialFitness 0-1 közötti szám normális esetben és az alap pontokkal azonos értéke van a teljes fitnessre
    // az alap+partial fitness score-t négyzetre emelem, hogy kihangsúlyozzam az újabb elért checkpoint értékét
    // végül az így kapott fitnesst az átlag sebességgel korrigálom -> büntetem a lassút, értékelem a gyors teljesítményt
    
    let baseFitness = this.score;
    let partialFitness = 0;
    let avgSpeed = this.sumSpeed / this.cntFrames;
    let speedCorrection = map(avgSpeed, 
                              this.minSpeed, this.maxSpeed, 
                              slownessPenalty, fastnessReward);
    if (this.lastChekpointIntersection) {
      let distFromLast = this.nextCheckpointCenter.dist(this.lastChekpointIntersection)
      let distFromNext = this.pos.dist(this.nextCheckpointCenter);
      partialFitness = map(distFromNext, 0, distFromLast, 1, 0)
    }
    this.fitness = ((baseFitness + partialFitness)**2) * speedCorrection;
  }
    
  killIfStucked(minScore) {
    if (this.score < minScore) {
      this.isAlive = 0;
    }
  } 
    
  detectWalls(object) {
    this.detections = this.radarCollider.checkForCollision(object)
  }
  
  checkForCollision(object) {
    this.collision = this.polyCollider.checkForCollision(object);
    if (this.collision) {this.isAlive = 0}
  }

  updatePolyCollider() {
    this.polyCollider.update(this.cornerPoints);
  }

  setCornerPoints(absResize = 0) {
    // source: https://gamedev.stackexchange.com/questions/86755/how-to-calculate-corner-positions-marks-of-a-rotated-tilted-rectangle
    this.cornerPoints = [];
    const xShifts = [-1, -1, 1, 1];
    const yShifts = [-1, 1, 1, -1];

    for (let i = 0; i < xShifts.length; i++) {
      // cornerX and Y without rotation and absolute location 
      let x = (xShifts[i] * (this.width + absResize)) / 2;
      let y = (yShifts[i] * (this.height + absResize)) / 2;

      // now apply rotation, but no absolute location
      let rotatedX = x * Math.cos(this.heading) - y * Math.sin(this.heading);
      let rotatedY = x * Math.sin(this.heading) + y * Math.cos(this.heading);

      // translate back (add absolute location)
      x = rotatedX + this.pos.x;
      y = rotatedY + this.pos.y;

      let newPoint = createVector(x, y);
      this.cornerPoints.push(newPoint);
    }
  }

  display() {

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);

    imageMode(CENTER);
    image(carPicture, 0, 0, this.width, this.height);
    
    // noStroke();
    // fill(color(0, 0, 0, 100));
    // rectMode(CENTER);
    // rect(0, 0, this.width, this.height);
    pop();

    if (showParentText) {
      noStroke();
      fill(255);
      textSize(30);
      textAlign(CENTER)
      text(this.text, this.pos.x-5, this.pos.y+5)
    }

    
//     noStroke();
//     fill(color(10, 250, 200));
//     circle(this.pos.x, this.pos.y, 12); // pos

    if (this.collision) {
      stroke(255);
      strokeWeight(3);
      fill(color(0, 0, 255));
      circle(this.collision.x, this.collision.y, 20); // pos
    }

    // this.polyCollider.display();
    // this.radarCollider.display();
  }
}
