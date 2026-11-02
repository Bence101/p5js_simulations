class Mover {
  constructor(owner) {
    this.settings = owner.settings;
    this.owner = owner;
    this.pos = this.owner.transform.pos;
    this.maxSpeed = 5;
    this.maxSteering = 0.2;
    this.directSteeringSpeed = 0.05;
    this.directSpeedChangeMagnitude = 0.2;
    this.wanderTargetAngle = 0;
    this.wanderCalled = 0;
    this.vel = createVector(random(-1, 1), random(-1, 1)).setMag(this.maxSpeed);
    this.accel = createVector(0, 0);
  }
  
  move() {
    this.vel.add(this.accel);
    this.vel.limit(this.maxSpeed);
    this.owner.transform.pos.add(this.vel);
    this.owner.transform.angle = this.vel.heading();

    
    let constrainedPos = Utils.constrainBorder(this.pos, this.settings, 'teleport')
    if (!this.pos.equals(constrainedPos)) {this.owner.transform.pos.set(constrainedPos);}
    
    // resetting values and handling dinamic variables
    if (this.wanderCalled == 0) {
      // if wander was NOT called between updates we must CHANGE the wanderTargetAngle
      this._randomizeWanderAngle();
    }
    
    this.wanderCalled = 0
    this.accel.set(0, 0);    
  }
  
  directSteering(direction) {
    this.vel.setHeading(this.vel.heading() + 
                        direction * this.directSteeringSpeed)
  }
  
  directSpeedChange(direction) {
    this.vel.setMag(this.vel.mag() + 
                   direction * this.directSpeedChangeMagnitude)
  }
  
  applyForce(force, forceMagnitude) {
    this.accel.add(force.copy().mult(forceMagnitude || 1));
  }
  
  seek(target, forceMagnitude = 1, mode=undefined) {
    let desiredSpeed = this.maxSpeed;
    let force =  p5.Vector.sub(target, this.pos);
    if (mode=='flee') {force.mult(-1)}
    if (mode == 'arrive') {
      let slowRadius = 100;
      let distFromTarget = force.mag();
      if (distFromTarget<slowRadius) {
        desiredSpeed = map(distFromTarget, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxSteering);
    
    this.applyForce(force, forceMagnitude);
  }
  
  flee(target, forceMagnitude=1) {
    this.seek(target, forceMagnitude, 'flee')
  }
  
  arrive(target, forceMagnitude=1) {
    this.seek(target, forceMagnitude, 'arrive')
  }
  
  teleport(pos, randomizeVelocity = true) {
    this.pos.set(pos);

    if (randomizeVelocity) {
      this.vel.set(createVector(random(-1, 1), 
                                    random(-1, 1)).setMag(this.maxSpeed));
    }
  }
  
  
  wander(forceMagnitude = 1) {
    // if wander was called between updates we must keep the wanderTargetAngle
    this.wanderCalled = 1;
    
    let steeringSensitivity = 0.3;
    let projectedDistance = 50;
    let wanderRadius = 50;
    let projectedCenter = this.vel.copy()

    projectedCenter.setMag(projectedDistance);
    projectedCenter.add(this.pos);

    this.wanderTargetAngle+=random(-steeringSensitivity, steeringSensitivity);
    let target = p5.Vector.fromAngle(this.wanderTargetAngle);
    target.setMag(wanderRadius);
    target.add(projectedCenter);
    
    if (SETTINGS.debug.showWanderGuides) {
      push();
        scale(viewTransformerControls.view.zoom);
        translate(viewTransformerControls.view.x, viewTransformerControls.view.y);
        noFill();
        stroke(color(200,0,0))
        circle(projectedCenter.x, projectedCenter.y, 5);
        stroke(color(0,0,0, 100))
        circle(projectedCenter.x, projectedCenter.y, wanderRadius*2);
        stroke(color(0,200,0))
        circle(target.x, target.y, 10);
        line(this.pos.x, this.pos.y, target.x, target.y);
      pop();
    }

    this.seek(target, forceMagnitude);
  }
  
  _randomizeWanderAngle() {
    this.wanderTargetAngle = random(0, TWO_PI)
  }
  
  
  avoidSegment(startSegment, endSegment, forceMagnitude = 1) {
    // be kell tenni egy future pos argumentumot, vagy futurePosShift argumentumot
      // ez az eyesight ray-ból jönne
      // ez azért kell, hogy keskeny obstacle esetén is jól működjön az algoritmus
    let minNewSpeed = 1; // not really important to control it from settings
    let minNewForce = 0.5; // not really important to control it from settings
    let projectedPosOnSegment = Utils.vectorProjection(this.pos, 
                                                             startSegment, endSegment);
    let futurePosShift = this.owner.properties.eyesight.viewDistance;
    
    let futurePos = this.vel.copy().setMag(futurePosShift).add(this.pos);
    let projectedFuturePosOnSegment = Utils.vectorProjection(futurePos, 
                                                             startSegment, endSegment);
    
    let target = p5.Vector.sub(futurePos, projectedFuturePosOnSegment);
    target.setMag(-this.pos.dist(projectedFuturePosOnSegment));
    target.add(futurePos);
    
    // this is really useful
    let currentSpeed = this.vel.mag();
    let newSpeed = map(this.pos.dist(projectedPosOnSegment), 
                         0, futurePosShift, 
                         minNewSpeed, this.maxSpeed);
    
    // not absolutely necessary, but maybe a little nicer avoidance
    let newForce = map(this.pos.dist(projectedPosOnSegment), 
                         0, futurePosShift, 
                         forceMagnitude, minNewForce);
    
    this.vel.setMag(min(currentSpeed, newSpeed));    
    this.seek(target, newForce);
    
    if (SETTINGS.debug.showAvoidSegmentGuides) {
      push();
        scale(viewTransformerControls.view.zoom);
        translate(viewTransformerControls.view.x, viewTransformerControls.view.y);
        noStroke();
        fill(color(255, 0, 0));
        circle(projectedFuturePosOnSegment.x, projectedFuturePosOnSegment.y, 10)
        fill(color(0, 0, 255));
        circle(futurePos.x, futurePos.y, 10)
        fill(color(255, 0, 255));
        circle(target.x, target.y, 15)
        fill(color(255, 255, 0));
        circle(projectedPosOnSegment.x, projectedPosOnSegment.y, 15)
      pop();
    }
  }
}

