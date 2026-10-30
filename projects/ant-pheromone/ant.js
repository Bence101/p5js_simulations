class Ant {
  constructor(pos, antHillPos, properties) {
    this.properties = properties;
    if (random(0,1)<=properties.traceRate) {
      // initially trace a portion of the population
      this.traceIt = 1;
    }
    this.pos = pos;
    this.size = properties.size;
    this.speed = properties.speed;
    this.vel = createVector(random(-1, 1), random(-1, 1)).setMag(this.speed);
    this.accel = createVector(0, 0);
    this.targetAngle = this.vel.heading(); // withouth this the start looks strange
    this.purpose = 'wander'; //return, toFood 
    this.hasFood = 0;
    this.pheromoneType = 'wander';
    this.infoTable = new InfoTable(this.pos, []);
    this.targetFood = undefined;
    this.antHillPos = antHillPos;
    this.pheromoneDirection = 0;
    this.pheromoneComponents = {'xSum':0,
                                'ySum':0,
                                'cnt':0};
    this.wanderAnywayCooldown = 0;
    this.antHillLastSeen = 0;
    this.colorAvoidObstacle = 0;

  }
  
  update() {
    this.setPurpose();
    this.updateInfoTable();
    this.move();
    this.antHillLastSeen +=1;
    this.seenAntHill();
  }
  
  mouseOver() {
    if (this.onIt(createVector(mouseX, mouseY))) {
      // if (!this.alreadyChanged) {
      //   print(this.vel.heading())
      //   this.vel.setHeading(this.vel.heading()*-1);
      //   print(this.vel.heading())
      //   this.alreadyChanged=1;
      // }

      return 1;
    } else {
      return 0;
    }
  }
  
  
  updateInfoTable() {
    let infoList = [
                    // {'name': 'pos', 'value': round(this.pos.x)},
                    {'name': 'purpose', 'value': this.purpose},
                    {'name': 'phCnt', 'value': str(this.pheromoneComponents.cnt)},
                    {'name': 'aHLS', 'value': str(this.antHillLastSeen)},
                    {'name': 'AvoidO', 'value': str(this.avoidObstacle)}
                    ]
    this.infoTable.update(this.pos, infoList);
  }
  
  checkForFood(foods) {
    if (!this.hasFood) {
      for (let food of foods) {
        if (this.isSeen(food.pos.copy(), food.size)) {
          this.targetFood = food.pos.copy();
          let reached = 0
          reached = this.reachFood(food.pos.copy());
          if (reached) {
            food.reduceQuantity();
          }        
          break;
        } else {
          this.targetFood = undefined;
        }
      }
    }
  }
  
  adjustPheromoneDirection(pos) {  
    this.pheromoneComponents.xSum += pos.x;
    this.pheromoneComponents.ySum += pos.y;
    this.pheromoneComponents.cnt += 1;
  }

  
  reachFood(pos) {
    if (this.pos.dist(pos)<this.properties.hitBoxRadius) {
      this.hasFood = 1;
      // this.vel = createVector(random(-1, 1), random(-1, 1)).setMag(this.speed);
      this.vel.setHeading(this.vel.heading()*-1)
      return 1;
    } else {
      return 0;
    }
  }
  
  reachAntHill() {
      this.vel = createVector(random(-1, 1), random(-1, 1)).setMag(this.speed);
  }
  
  
  
  
  setPurpose() {
    if (random(0,1)<=this.properties.wanderAnywayRate) {
     this.wanderAnywayCooldown = this.properties.wanderAnywayCooldown;
    }
    if (this.wanderAnywayCooldown>0) {
      this.purpose = 'wander';
    } else if (this.hasFood) {
      if (this.isSeen(this.antHillPos, 100)) {
        this.purpose = 'toAntHill';
      } else if (this.pheromoneComponents.cnt>0) {
        this.purpose = 'followPheromone'
      } else {
       this.purpose = 'wander';
      }
      this.pheromoneType = 'return'
    } else if (this.targetFood) {
      this.purpose = 'toFood'
    } else if (this.pheromoneComponents.cnt>0) {
      this.purpose = 'followPheromone'
    } else {
      this.purpose = 'wander';
      this.pheromoneType = 'wander'
    }
    this.wanderAnywayCooldown-=1
  }
  

  
  wander() {
    let steeringSensitivity = this.properties.wanderingProperties.steeringSensitivity;

    this.targetAngle+=random(-steeringSensitivity, steeringSensitivity);
    let target = p5.Vector.fromAngle(this.targetAngle).add(this.pos);
    
    this.accelerateToTarget(target);
  }
  
  toFood() {
    this.accelerateToTarget(this.targetFood);
    this.targetFood = undefined;
  }
  
  toAntHill() {
    // if the antHill is directly seen, then the ant should directly go to it
    this.accelerateToTarget(this.antHillPos);
  }
  
  seenAntHill() {
    if (this.isSeen(this.antHillPos, 100)) {
      this.antHillLastSeen = 0;
    }
  }
  
  followPheromone() {
    let pheromoneXAvg = this.pheromoneComponents.xSum/this.pheromoneComponents.cnt;
    let pheromoneYAvg = this.pheromoneComponents.ySum/this.pheromoneComponents.cnt;
    let target = createVector(pheromoneXAvg, pheromoneYAvg);
    
    // try jitter
    // let steeringSensitivity = this.properties.wanderingProperties.steeringSensitivity;
    // let jitter =random(-steeringSensitivity, steeringSensitivity);
    // target.setHeading(target.heading()+jitter/2);
    
    // átmenetileg ezzel lehet csekkolni a célját a hangyának
    // fill(color(255,255,0))
    // circle(target.x, target.y, 10)
    
    this.accelerateToTarget(target);
    this.pheromoneComponents.xSum = 0;
    this.pheromoneComponents.ySum = 0;
    this.pheromoneComponents.cnt = 0;
  }
    
  applyAcceleration(directionVector, forceMagnitude) {
    this.accel.add(directionVector.copy().setMag(forceMagnitude));
  }
  
  accelerateToTarget(target) {
    let desiredDirection = this.seekTarget(target);
    this.applyAcceleration(desiredDirection, this.properties.steeringStrength);
  }
  
  
  seekTarget(target) {
    let desiredDirection = p5.Vector.sub(target, this.pos);
    desiredDirection.normalize();
    return desiredDirection
    // this.applyAcceleration(desiredDirection, this.properties.steeringStrength);
  }
  
  fleeTarget(target) {
    return this.seekTarget(target).mult(-1);
  }
  
  getProjectedPos(len) {
    let projectedPos = p5.Vector.add(this.pos, this.vel.copy().setMag(len));
    return projectedPos;
  }
  
  avoidTarget(target) {
    // valamiért néha belassítja a hangyákat, ha nyersen használom!
    let desiredDirection = this.fleeTarget(target);
    this.applyAcceleration(desiredDirection, this.properties.steeringStrength);
    this.avoidObstacle = 1;
  }
  
//   evadeObstacle(avoidanceDirection) {
//     // let desired = createVector(avoidanceDirection.x*3 || this.vel.x,
//     //                             avoidanceDirection.y*3 || this.vel.y);
//     let desired = createVector(this.vel.x+avoidanceDirection.x*2,
//                                 this.vel.y+avoidanceDirection.y*2);
//     desired.normalize()
//     let steer = desired//p5.Vector.sub(desired, this.vel);
    
//     fill(0)
//     circle(this.pos.x+desired.x*10, this.pos.y+desired.y*10, 10)
    
//     this.applyAcceleration(steer, this.properties.steeringStrength*10);
//     this.avoidObstacle = 1;
//     this.colorAvoidObstacle=1;
//   }
  
  evadeObstacle(avoidanceDirection) {
    // a paraméterezést és az "aktivációs függvényt" kell jól kitalálni

    let reductionRate = 1
    this.vel = createVector(this.vel.x+avoidanceDirection.x*reductionRate,
                                this.vel.y+avoidanceDirection.y*reductionRate);
    this.targetAngle = this.vel.heading();
    // this.avoidObstacle = 1;
    this.colorAvoidObstacle=1;
  }
  
  
  move() {
    if (!this.avoidObstacle) {
      if (this.purpose == 'wander') {
        this.wander();
      }
      if (this.purpose == 'toFood') {
        this.toFood();
      }
      if (this.purpose == 'toAntHill') {
        // if close, go directly to AntHill
        this.toAntHill(); 
      }
      if (this.purpose == 'followPheromone') {
        this.followPheromone();
      }
    }
    this.avoidObstacle = 0;
    this.colorAvoidObstacle = 0;

    
    
    this.vel.add(this.accel);
    this.vel.limit(this.speed);
    this.pos.add(this.vel);
    
    
    let constrainedPos = constrainBorder(this.pos, 'teleport')
    if (!this.pos.equals(constrainedPos)) {
      this.pos = constrainedPos;
      
      
      // // // ez elvileg visszapattintaná a szélről
      // if (this.bounceCoolDown<0) {
      //   this.bounceCoolDown = 100;
      //   this.vel.mult(-1);
      //   print(11)
      // // // this.targetAngle=this.vel.heading();
      // } 
    }
    this.accel.set(0, 0);
  }
  
  isSeen(vector, objectRadius = 0) {
    // check if a point is in the objects field of view
      // the field of view is not effected by the objectRadius!
    if (vector.dist(this.pos)<=(this.properties.viewDistance/2+objectRadius/2 )) {
      let diffVector = p5.Vector.sub(vector, this.pos);
      if (abs(diffVector.heading()-this.vel.heading())<this.properties.fieldOfView) {
          return 1;
          }
    }
    return 0;
  }
  
  onIt(vector) {
    if (this.pos.dist(vector)<this.size) {
      return 1;
    } else {
      return 0;
    }
  }
  
  displayTracing() {
    if (this.traceIt || this.mouseOver()) {
      // displaying hitbox
      strokeWeight(2);
      noFill();
      
      if (this.colorAvoidObstacle == 1) {
        stroke(color(255,0,0));
      } else if (this.purpose == 'wander') {
        stroke(color(0,255,255));
      } else if (this.purpose == 'toFood') {
        stroke(color(0,100,100));
      } else if (this.purpose == 'return') {
        stroke(color(255,0,0));
      }

      circle(this.pos.x, this.pos.y, this.properties.hitBoxRadius);
      // circle(this.target.x, this.target.y, 10);
      
      
      // displaying field of view
      let fieldOfView = this.properties.fieldOfView;
      let viewDistance = this.properties.viewDistance;
      strokeWeight(2);
      noFill();
      stroke(color(0,255,0));
      // circle(this.pos.x, this.pos.y, this.properties.viewDistance);
      arc(this.pos.x, this.pos.y, 
          viewDistance, viewDistance, 
          this.vel.heading()-fieldOfView, this.vel.heading()+fieldOfView, 
         PIE);
      
      
      // infoTable display
      if (this.wanderAnywayCooldown>0) {
        fill(color(0,200,200));
        noStroke();
        circle(this.pos.x, this.pos.y, 10);
      }
      
      // show wander anyway tracer
      // if (this.wanderAnywayCooldown>0) {
      //   fill(color(0,200,200));
      //   noStroke();
      //   circle(this.pos.x, this.pos.y, 10);
      // }
      
      
      // see mouse?
//       let mouseRadius = 50;
//       if (this.isSeen(createVector(mouseX, mouseY), mouseRadius)) {
        
//         fill(color(0,200,200));
//         noStroke();
//         circle(mouseX, mouseY, mouseRadius);
//       } else {
//         fill(color(0,200,200, 50));
//         noStroke();
//         circle(mouseX, mouseY, mouseRadius);
//       }
      
      this.infoTable.display();
    }
    // if (this.mouseOver()) {
    //   this.infoTable.display();
    // }
  }
  
  display() {
    this.displayTracing()

    push();
      translate(this.pos.x, this.pos.y);
      rotate(PI/2+this.vel.heading());
      imageMode(CENTER);
      image(antImg, 0, 0, this.size, this.size);
      if (this.hasFood) {
        fill(color(0, 255, 0));
        circle(0, -11, 5);
      }
    pop();
    
// show projectedPos
    // let test = this.getProjectedPos(20);
    // fill(color(255,0,0));
    // circle(test.x, test.y, 10)
  }
}