// még ki kell gondolni, hogy pontosan mi legyen a Map szerepe, mit érdemes itt tárolni?
  // anthill, obstacles?
  // ant, pheromone?
  // food
  // valahogy úgy képzelem a dolgot, hogy egy simulation-ban 1 map van
    // és a map tárolná az entitásokat, a szimuláció pedig kezelné a kölcsönhatásokat
  // alternatívaként
    // a map csak

class Field {
  constructor(settings) {
    this.settings = settings;
    this.obstacleId = 0;
    this.antHills = [];
    this.obstacles = [];
    this.foods = [];
    this.createAnthills();
    this.createObstacles();
    this.createBorderObstacles()
    this.createInitialFoods();
  }
  
  update() {
    for (let antHill of this.antHills) {
      antHill.update();
    }
    
    // az első obstacle követi tőle az egeret
    // this.testObstacleUpdate();
    
    this.removeDepleatedFoods();
  }
  
  
//   testObstacleUpdate() {
//     // ezt majd töröld!
//     let size = 120;
//     let testObstacle = this.obstacles[0];
//     testObstacle.posStart= createVector(mouseX-size/2, mouseY-size/2);
//     testObstacle.posCenter = createVector(mouseX, mouseY)
//     testObstacle.width = size;
//     testObstacle.height = size;
    
//   }
  
  
  createAnthills() {
    // ezt a settings alapján paraméterezzünk és listába tároljuk
    // több antHill-t is lehessen létrehozni és legyenek nekik tulajdonságaik (pl team 1, init food stb.)
    for (let antHillSetting of this.settings.anthills) {
      this.antHills.push(new AntHill(antHillSetting));
    }
  }
  
  
  createBorderObstacles() {
  let obsThickness = 100;
  let offset = 10;
  // (posStart, width, height, properties, id)
  let obsCoordinates = [
          [-obsThickness, -obsThickness, width+obsThickness*2, obsThickness+offset],
          [-obsThickness, -obsThickness, obsThickness+offset, height+obsThickness*2],
          [-obsThickness, height-offset, width+obsThickness*2, obsThickness],
          [width-offset, -obsThickness, obsThickness, height+obsThickness*2]
  ]
    
    for (let coordinate of obsCoordinates) {
      this.createObstacle(createVector(coordinate[0], coordinate[1]), 
                          coordinate[2], coordinate[3], 
                          this.settings.obstacles, this.obstacleId);
      this.obstacleId++;
    } 
  }
  
  createObstacles() {
    for (let obstacle of this.settings.obstacles.obstacles) {
      this.createObstacle(createVector(obstacle[0], obstacle[1]), 
                          obstacle[2], obstacle[3], 
                          this.settings.obstacles, this.obstacleId);
      this.obstacleId++;
    } 
  }
  
  createInitialFoods() {
    for (let food of this.settings.foods.foods) {
      this.createFood(createVector(food[0], food[1]), 
                      food[2], this.settings.foods);
    } 
  }
  
  createFood(pos, quantity, properties) {
    this.foods.push(new Food(pos, quantity, properties));
  }
  
  removeDepleatedFoods() {
    for (let i=this.foods.length-1; i>=0; i--) {
      if (this.foods[i].quantity<=0) {
        this.foods.splice(i, 1);
      }
    }
  }
  
  createObstacle(posStart, width, height, properties, id) {
    this.obstacles.push(new Obstacle(posStart, width, height, properties, id));
  }
  

    
  display() {
    for (let obstacle of this.obstacles) {
      obstacle.display();
    }
    for (let food of this.foods) {
      food.display();
    }
    for (let antHill of this.antHills) {
      antHill.display()
      for (let ant of antHill.ants) {
        ant.display();
      }
      if (this.settings.showPheromones) {
        for (let pheromone of antHill.pheromones) {
          pheromone.display();
        }
      }
    }
  }
}