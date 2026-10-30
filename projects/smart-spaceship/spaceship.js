class SpaceShip {
  constructor(x_start, y_start, size, lifetime) {
    this.pos = createVector(x_start, y_start);
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.maxVel = AGENTSPEED;
    this.maxAccel = 0.1;
    this.size = size;
    this.thrusterForce = 1;
    this.fitness=0;
    this.finished=0;
    this.died = 0;
    this.finishedAt = 0;
    this.diedAt = 0;
    this.alpha = 128;
    // this.gravityForce = 0.01;
    if (GENETRACINGBYCOLOR) {
      this.color = color(random(255), random(255), random(255), this.alpha);
    } else {
      this.color = color(150, 50, 50, this.alpha);
    }

    this.lifetime = lifetime;
    this.dna = new DNA(lifetime);
    this.age = 0;
  }
  
  apply_acceleration(directionVector, forceMagnitude) {
    this.accel.add(directionVector.copy().setMag(forceMagnitude));
  }
  
  update() {
    // this.steer();
    // apply gravity   
    // HIBÁRA FUT, HA ELFOGYTAK A GÉNEK! (ez addig nem probléma, amíg a szimuláció nem tart tovább mint a gének száma, ami normál esetben igaz)
    
    this.finishCheck();
    if (this.finished==0 && this.died==0) {
      let directionFromDNA = this.dna.genes[this.age]
      this.apply_acceleration(directionFromDNA, this.thrusterForce);

      // this.accel.limit(this.maxAccel)
      this.vel.add(this.accel);
      this.vel.limit(this.maxVel);
      this.pos.add(this.vel);
      this.acc = 0;
    }
    
    this.age+=1;
  }
  
  finishCheck() {
    if (this.finished==0) {
      if (this.pos.dist(TARGET)<FINISH_DIST) {
        this.finished=1;
        this.finishedAt = this.age;
      }
    }
  }
  
  obstacleCheck(obstacles) {
    if (this.died==0) {
    if (this.pos.x<=0 || this.pos.y<=0 ||
        this.pos.x>=width || this.pos.y>=height ) {
      this.died=1;
    } else {
      for (let obstacle of obstacles) {
        if (obstacle.contains(this.pos)) {
          this.died=1;
          this.diedAt = this.age;
        }
      }
    }
    }
  }
  
  
  calculateFitness(target) {
    this.fitness=1/target.dist(this.pos);
    if (this.died==1) {
      // reward for surviving / penalty for quick death
      if (QUICKDEATHPENALTY>0) {
        this.fitness*=QUICKDEATHPENALTY*(this.diedAt/this.lifetime);
      }
      this.fitness*=BASEDEATHPENALTY;
    }
    if (this.finished==1) {
      // reward for finish/finish speed
      this.fitness*=1+QUICKFINISHREWARD*(1-this.finishedAt/this.lifetime); 
      this.fitness*=1+BASEFINISHREWARD;
    }
  }
  
  display() {
    
    noStroke();
    fill(this.color);
    // rect(this.pos.x, this.pos.y, this.size*4, this.size*2);
    
    let triangleCoordinates = this.calculate_triangle_points()
    triangle(triangleCoordinates.x1, triangleCoordinates.y1,
      triangleCoordinates.x2, triangleCoordinates.y2,
      triangleCoordinates.x3, triangleCoordinates.y3);
  }
  

  calculate_triangle_points() {
    let offset = 0.2
    let angle = this.vel.heading()
    let x2 = this.pos.x - this.size * cos(angle + offset)
    let y2 = this.pos.y - this.size * sin(angle + offset)
    let x3 = this.pos.x - this.size * cos(angle - offset)
    let y3 = this.pos.y - this.size * sin(angle - offset)
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