class AntHill {
  constructor(settings) {
    this.settings = settings;
    this.pos = createVector(settings.pos[0], settings.pos[1]);
    this.size = settings.size;
    this.initialAnts = settings.initialAnts;
    this.ants = [];
    this.pheromones = [];
    this.pheromoneRate = settings.pheromoneRate;
    this.pheromoneTicker = 0;
    this.antCost = 10;
    this.food = settings.initialFood;
    this.antProperties = settings.antProperties;
    this.color = color(settings.color[0], settings.color[1], settings.color[2])
    this.createInitialAnts();
  }
  
  update() {
    this.pheromoneTicker++;
    this.reproduce();
    for (let ant of this.ants) {
      ant.update();
      if (this.pheromoneTicker%this.pheromoneRate==0) {
        // this.pheromones.push(ant.createPheromone(this.settings.pheromoneProperties));
        if ( ant.antHillLastSeen<this.settings.maxAntHillLastSeen || ant.hasFood) {
          this.pheromones.push(new Pheromone(ant.pos.copy(), 
                                             ant.pheromoneType,
                                             -ant.vel.heading(),
                                             this.settings.pheromoneProperties));
        }
      }
    }
    for (let pheromone of this.pheromones) {
      pheromone.update();
    }
    for (let i=this.pheromones.length-1; i>=0; i--) {
      if (this.pheromones[i].lifeTime<=0) {
        this.pheromones.splice(i, 1);
      }
    }
  }
  
  createInitialAnts() {
    for (let i=0; i<this.initialAnts; i++) {
      this.createAnt();
    }
  }
  
  reproduce() {
    while (this.food >= this.antCost) {
      this.createAnt();
      this.food-=this.antCost;
    }
  }
  
  createAnt() {
    this.ants.push(new Ant(this.pos.copy(), this.pos.copy(), this.antProperties));
  }
  
  
  display() {
    fill(this.color);
    noStroke();
    circle(this.pos.x, this.pos.y, this.size);
    fill(color(255, 255, 255));
    textAlign(CENTER, CENTER);
    text(str(this.ants.length), this.pos.x, this.pos.y);
  }
}