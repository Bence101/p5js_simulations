class Cell {
  constructor(pos, groupNum) {
    this.pos = pos
    this.vel = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.size = 3
    this.groupNum = groupNum
    this.attractionDistance = 30
    
    this.maxSpeed = 5
    this.friction = 0.95
    
    let colors = {0:color(200, 0, 0),
                  1:color(0, 200, 0),
                  2:color(0, 0, 255),
                  3:color(200, 200, 0),
                  4:color(0, 200, 255),
                  5:color(200, 0, 255),
                 }
    
    this.color = colors[groupNum]
  }
  
  update() {
    this.move()
  }
  
  move() {
    let minValidVel = 0.01
    this.vel.add(this.acceleration)
    this.vel.mult(this.friction)
    if(this.vel.mag() < minValidVel) {
      this.vel.set(0,0)
    }
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel)
    this.pos = constrainBorder(this.pos, 'teleport')
    this.acceleration.set(0,0)
  }

  
  accelerateToTarget(pos, forceMagnitude) {
    let target = createVector(pos.x - this.pos.x, pos.y - this.pos.y);
    target.normalize();
    this.acceleration.add(target.copy().setMag(forceMagnitude));
  }
  
  isClose(pos, objectRadius = 0) {
    if (pos.dist(this.pos)<=(this.attractionDistance+objectRadius)) {
      return 1;
    }
    return 0;
  }
  
  
  interact(other, connectionStrengthMatrix) {

    let repelDist = 12
    let forceReducer = 1
    
    if (!(this.isClose(other.pos, this.attractionDistance))) {
      return
    }
    if (this === other) {
      return
    }
    let dist = this.pos.dist(other.pos)
    let force = connectionStrengthMatrix[this.groupNum][other.groupNum]
    force = this.getForceByDistance(force, dist, repelDist, this.attractionDistance)
    
    
    force = force/forceReducer
    this.accelerateToTarget(other.pos, force)
    
  }
  
      
  getForceByDistance(originalForce, distance, repelDist, maxDist) {
    let middle = (repelDist + maxDist) / 2;
    if (distance <= repelDist) {
      return -1 + (distance / repelDist)
    } 
    if (distance > repelDist && distance <= middle) {
      return map(distance, repelDist, middle, 0, originalForce);
    } 
    if (distance > middle && distance < maxDist) {
      return map(distance, middle, maxDist, originalForce, 0);
    }
    return 0
  }
      

  display() {
    push()
      noStroke()
      fill(this.color)
      circle(this.pos.x, this.pos.y, this.size*2)
    pop()
    
    // display attraction circles
    // noFill()
    // stroke(255);
    // circle(this.pos.x, this.pos.y, this.attractionDistance*2)
  }
}
    
    
    
    