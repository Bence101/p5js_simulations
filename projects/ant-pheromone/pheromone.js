class Pheromone {
  constructor(pos, type, direction, properties) {
    this.pos = pos;
    if (random(0,1)<=properties.traceRate) {
      // initially trace a portion of the population
      this.traceIt = 1;
    } else {
      this.traceIt = 0;
    }
    
    this.direction = direction;
    if (type=="wander") {
      this.color = properties.wanderColor;
      this.lifeTime = properties.lifeTime*properties.lifeTimeWanderMultiplier;
    } 
    if (type == "return") {
      this.color = properties.returnColor;
      this.lifeTime = properties.lifeTime*properties.lifeTimeReturnMultiplier;
    }
    this.lifeTimeOrig = this.lifeTime;
    this.size = properties.size;
    this.strength = 1;
    this.type = type;
  }
  
  update() {
    this.reduceLifeTime();
  }
  
  reduceLifeTime() {
    if (this.lifeTime>0) {
      this.lifeTime-=1;
    }
  }
  
  
  display() {
    if (this.traceIt) {
      noStroke();
      fill(color(this.color[0], this.color[1], this.color[2],
           map(this.lifeTime/10, 0, this.lifeTimeOrig, 0, 255, true)));
      // fill(color(this.color[0], this.color[1], this.color[2]));

      circle(this.pos.x, this.pos.y, this.size);
      // fill(0)
      // text(Math.round(map(this.lifeTime, 0, this.lifeTimeOrig, 0, 255, true)), 
           // this.pos.x, this.pos.y, 10 )
    }

  }
}