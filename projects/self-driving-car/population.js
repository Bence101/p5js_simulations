class Population {
  constructor(popSize, agePerScore, prevPop) {
      this.agents = [];
      this.newAgents = [];
      this.matingPool = [];
      this.popSize = popSize;
      this.sumFitness = 0;
      this.maxFitness = 0;
      this.age = 0;
      this.maxAge = agePerScore;
      this.finisherRate = 0; // for plotting only
      this.hasAlive = 1;
    if (typeof prevPop == "undefined") {
      this.createInitialPop();
      } 
    else {
      this.createMatedPop(prevPop);
      this.maxAge = agePerScore + prevPop.maxScore * agePerScore;
      this.createWithBrain(prevPop.bestNN, prevPop.bestNum)
    }
  }
  
  update(obstacles) {
    this.hasAlive = 0;
    for (let agent of this.agents) {
      agent.update(obstacles);
      if ((this.age>200)) {
        // kill agents if they could not score
        agent.killIfStucked(1)
      }
      if ((agent.isAlive) && (!agent.finished)) {
        this.hasAlive = 1;
      }
    }
    this.age++;
  }
  
  display(obstacles) {
    for (let agent of this.agents) {
      agent.display();
    }
  }
  
  createMatedPop(prevPop) {
    let n = this.popSize - 1
    for (let i = 0; i < n; i++) {
      // egyelőre csak 1 szülős mutációs öröklés!
      let nn;
      let onlyBestMate = 0;
      let parentNum = -1;
      if (onlyBestMate) {
        nn = prevPop.bestNN.copy();
      } else {
        parentNum = prevPop.selectForMating();
        let parentA = prevPop.agents[parentNum];
        nn = parentA.brain.nn.copy();
      }
      
      nn.mutate(Utils.mutationFunction)
      let newAgent = new Car(START_POINT, STARTANGLE, nn);

      newAgent.text = str(parentNum);
      this.agents.push(newAgent);
    }
  } 
  
  createInitialPop() {
    for (let i = 0; i < this.popSize; i++) {
      let newAgent = new Car(START_POINT, STARTANGLE)
      this.agents.push(newAgent)
    }
  }
  
  createWithBrain(brain, num) {
    if (brain) {
      let newAgent = new Car(START_POINT, STARTANGLE, brain.copy());
      newAgent.text = 'best' + str(num)
      this.agents.push(newAgent);
    }
  }
  
  calculateFitnesses() {
    let finisherCount=0;
    for (let i=0; i < this.agents.length; i++) {
      let agent = this.agents[i];
      agent.calculateFitness();
      finisherCount+=agent.finished;
      if (this.maxFitness<agent.fitness) {
        this.maxFitness=agent.fitness
        this.maxScore=agent.score;
        this.bestNum = i
        this.bestNN = agent.brain.nn.copy();
      }
      this.sumFitness+=agent.fitness
    }
    // KPIs to plot
    this.finisherRate = finisherCount/this.popSize;
    this.avgFitness = this.sumFitness/this.popSize;
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