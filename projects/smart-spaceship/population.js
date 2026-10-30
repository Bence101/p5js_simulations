class Population {
  constructor(popSize, lifetime, target, prevPop) {
      this.agents = [];
      this.newAgents = [];
      this.matingPool = [];
      this.popSize = popSize;
      this.age = 0;
      this.lifetime = lifetime;
      this.target=target;
      this.sumFitness = 0;
      this.maxFitness = 0;
      this.finisherRate = 0;
      this.deathRate = 0;
    
    if (typeof prevPop == "undefined") {
      this.createInitialPop();
      } 
    else {
      this.createMatedPop(prevPop);
    }
  }
  

  
  update(obstacles) {
  for (let agent of this.agents) {
    agent.obstacleCheck(obstacles);
    agent.update();
    // agent.display();
  }
    this.age++;
  }
  
  
  display(obstacles) {
  for (let agent of this.agents) {
    agent.display();
  }
  }
  
  
  createMatedPop(prevPop) {
    for (let i = 0; i < this.popSize; i++) {
      let newShip = new SpaceShip(START_POINT.x, 
                                     START_POINT.y, 
                                     20, this.lifetime)
      let parentA = prevPop.selectForMating();
      let parentB = prevPop.selectForMating();
      
      let newGenes = parentA.dna.crossover(parentB.dna);
      
      newShip.dna.genes=newGenes;
      newShip.dna.mutate(MUTATION_RATE);
      
      if (GENETRACINGBYCOLOR) {
        newShip.color=this.genTracingByColor(parentA, parentB);
      }
      this.agents.push(newShip);
    }
  } 
  
  createInitialPop() {
    for (let i = 0; i < this.popSize; i++) {
      this.agents.push(new SpaceShip(START_POINT.x, 
                                     START_POINT.y, 
                                     20, this.lifetime))
    }
  }
  
  calculateFitnesses() {
    let finisherCount=0;
    let deathCount=0;
    for (let agent of this.agents) {
      agent.calculateFitness(this.target);
      finisherCount+=agent.finished;
      deathCount+=agent.died;
      if (this.maxFitness<agent.fitness) {this.maxFitness=agent.fitness}
      this.sumFitness+=agent.fitness
    }
    // KPIs to plot
    this.finisherRate = finisherCount/this.popSize;
    this.deathRate = deathCount/this.popSize;
    this.avgFitness = this.sumFitness/this.popSize;
  }
  
  selectForMating() {
    // returns the copy of an agent with fitness weightin
    // source: https://blobfolio.com/2019/randomizing-weighted-choices-in-javascript/
    let threshold=random()*this.sumFitness;
    let cumulativeFitness=0
    for (let agent of this.agents) {
      cumulativeFitness+=agent.fitness;

      if (cumulativeFitness>threshold) {
        return(agent);
      }
    }
  }
  
  genTracingByColor(parentA, parentB) {
    // the base newColor is the mutation
    let newColor;

    if (COLORINGAPPROACH == 'fitness weighted average') {
      let sumFitness = (parentA.fitness+parentB.fitness)
      newColor = color(
                            (parentA.fitness*parentA.color.levels[0]+
                             parentB.fitness*parentB.color.levels[0])/sumFitness,
                            (parentA.fitness*parentA.color.levels[1]+
                             parentB.fitness*parentB.color.levels[1])/sumFitness,
                            (parentA.fitness*parentA.color.levels[2]+
                             parentB.fitness*parentB.color.levels[2])/sumFitness
                          )
    } else if (COLORINGAPPROACH == 'average') {
      newColor = color(
                            (parentA.color.levels[0]+
                             parentB.color.levels[0])/2,
                            (parentA.color.levels[1]+
                             parentB.color.levels[1])/2,
                            (parentA.color.levels[2]+
                             parentB.color.levels[2])/2
                          )
    } else if (COLORINGAPPROACH == 'component mix') {
      newColor = color(random([parentA.color.levels[0], parentB.color.levels[0]]),
                       random([parentA.color.levels[1], parentB.color.levels[1]]),
                       random([parentA.color.levels[2], parentB.color.levels[2]])
                          )
    }
    
    // mutate color by component
    let mutationRateBoost = 3;
    for (let i = 0; i < 3; i++) {
      if (random()<=MUTATION_RATE*mutationRateBoost) {
        newColor.levels[i] = random(255);
      }
    }
    
    // the alpha component should stay the same
    newColor.setAlpha(parentA.color.levels[3]);
    
    return newColor;
  }
  
}