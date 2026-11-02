class Simulation {
  constructor(settings) {
    this.settings = settings;
    this.simStep = 0;
    this.creatures = [];
    this.initSimulation();
  }

  initSimulation() {
    this.board = new Board(this);
    
    for (let i = 0; i < this.settings.simulation.nCreatures; i++) {
      this.creatures[i] = new Creature(
        createVector(random(0, this.settings.board.boardWidth), 
                     random(0, this.settings.board.boardHeight)),
        30,
        this.settings
      );
    }
  }
  
  handleCreatures() {
    for (let creature of this.creatures) {
      this.creatures.forEach((object) => object.handleObstacles(this.board.obstacles));
    }
  }

  update() {
    this.handleCreatures();
    
    this.creatures.forEach((object) => object.update());
    this.simStep++;
  }

  display() {    
    this.board.display()
    this.creatures.forEach((object) => object.display());
  }
}
