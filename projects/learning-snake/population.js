class Population {
  constructor(popSize, agentClass, agentBaseProperties, prevPop) {
      this.agentClass = agentClass
      this.agentBaseProperties = agentBaseProperties
      this.agents = [];
      this.popSize = popSize;
      this.sumFitness = 0;
      this.maxFitness = 0;
      this.age = 0;
      this.finisherRate = 0; // for plotting only
      this.populationNotDone = 1; // ezt nevezd át értelmesebbre!
      if (typeof prevPop == "undefined") {
        this.createInitialPop();
        } 
      else {
        this.createMatedPop(prevPop);
      // this.createWithBrain(prevPop.bestBrain, prevPop.bestNum)
    }
  }
  
  update() {
    this.populationNotDone = 0;
    for (let agent of this.agents) {
      agent.update();
      if ((agent.isAlive) && (!agent.isFinished)) {
        this.populationNotDone = 1;
      }
    }
    this.age++;
  }
   
  createMatedPop(prevPop) {
    // TODO: lehetséges paraméter: doCrossover=true/false
    let testFitnessesOrig = [] // törölhető
    let testFitnessesChosen = [] // törölhető

    let n = this.popSize
    for (let i = 0; i < n; i++) {
      // it can mate with itself, but it is not really a problem
      let parentNumA = prevPop.selectForMating();
      let parentA = prevPop.agents[parentNumA];
      let parentNumB = prevPop.selectForMating();
      let parentB = prevPop.agents[parentNumB];
      
      testFitnessesChosen.push(parentA.fitness) // törölhető

      let childBrain = parentA.brain.crossover(parentB.brain);
      childBrain.mutate(mutationFunctionGaussian)
      
      let newAgent = new this.agentClass(...this.agentBaseProperties);
      newAgent.setBrain(childBrain.copy())
      this.agents.push(newAgent);
    }
    
    
    // innentől törölhető a függvény többi része
//     for (let agent of prevPop.agents) {
//       testFitnessesOrig.push(agent.fitness)
//     }
    
//     let occurrences = testFitnessesOrig.reduce(function (acc, curr) {
//       return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
//     }, {});
//     print('orig occ:', occurrences)
    
//     occurrences = testFitnessesChosen.reduce(function (acc, curr) {
//       return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
//     }, {});
//     print('chosen occ:', occurrences)
    
  } 
  
  createInitialPop() {
    for (let i = 0; i < this.popSize; i++) {
      let newAgent = new this.agentClass(...this.agentBaseProperties)
      this.agents.push(newAgent)
    }
  }
  
  // createWithBrain(brain, num) {
  //  // egyelőre kiszedtem, mert csak a fix best survival-hoz kell
  //   if (brain) {
  //     let newAgent = new this.agentClass(this.agentBaseProperties);
  //     newAgent.setBrain(brain.copy())
  //     // newAgent.text = 'best' + str(num)
  //     this.agents.push(newAgent);
  //   }
  // }
  
  calculateFitnesses() {
    this.sumFitness = 0
    this.sumScore = 0
    this.sumSteps = 0 // ez lehet, hogy törlendő az általánosból
    this.maxFitness = 0
    this.maxScore = 0
    this.maxSteps = 0 // ez lehet, hogy törlendő az általánosból
    let finisherCount=0
    for (let i=0; i < this.agents.length; i++) {
      let agent = this.agents[i]
      agent.calculateFitness()
      finisherCount+=agent.isFinished
      if (this.maxFitness<agent.fitness) {
        this.maxFitness=agent.fitness
        this.maxScore=agent.score
        this.maxSteps = agent.steps
        this.bestNum = i
        this.bestBrain = agent.brain.copy()
      }

      this.sumFitness+=agent.fitness
      this.sumScore+=agent.score
      this.sumSteps+=agent.steps
    }
    // KPIs to plot
    this.finisherRate = finisherCount/this.popSize
    this.avgFitness = this.sumFitness/this.popSize
    this.avgScore = this.sumScore/this.popSize
    this.avgSteps = this.sumSteps/this.popSize
  }
  
  selectForMating() {
    // returns the copy of an agent with fitness weightin
    // source: https://blobfolio.com/2019/randomizing-weighted-choices-in-javascript/ 
    let threshold=random()*this.sumFitness;
    let cumulativeFitness=0
    for (let i=0; i < this.agents.length; i++) {
      cumulativeFitness+=this.agents[i].fitness;

      if (cumulativeFitness>threshold) {
        return(i);
      }
    }
    return(int(random(0, this.agents.length)));
  }
}