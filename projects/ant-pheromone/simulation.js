class Simulation {
  constructor(settings) {
    this.settings=settings;
    this.antHillSettings = settings.anthills
    this.initializeSimulation();
    this.simStep=0;
    this.simStatPos = createVector(10,10);
    this.infoTable = new InfoTable(this.simStatPos, []);

  }
  
  initializeSimulation() {
    this.map = new Field(this.settings);
  }
  
  update() {
    this.map.update();
    this.foodHandling();
    this.pheromoneMovement();
    this.obstacleHandling();
    this.simStep+=1;
    this.updateInfoTable();
    
    // // test
    // let test =this.map.obstacles[4].getAvoidanceDirection(createVector(mouseX, mouseY), 30); 
    // print(test.x, test.y)
    // fill(color(0,0,0, 20));
    // rect(50, 370, 260, 110)
    
  }
  
  foodHandling() {
    // itt még problémás, hogy csak 1 antHill-t kezelt
    for (let antHill of this.map.antHills) {
      for (let ant of antHill.ants) {
        // return food
        // ant.checkForFood(this.map.foods);
        if (ant.hasFood) {
          if (ant.onIt(antHill.pos)) {
            ant.hasFood = 0;
            ant.reachAntHill();
            antHill.food+=1;
          } 
        } else {
            ant.checkForFood(this.map.foods);
        }
      }
    }
  }
  
  
  
  obstacleHandling() {
    for (let antHill of this.map.antHills) {
      for (let ant of antHill.ants) {     
        for (let obstacle of this.map.obstacles) {
          if (obstacle.contains(ant.pos, 0)) {
            // ez kérdéses, hogy benne maradjon-e?!
            ant.avoidTarget(obstacle.posCenter);
            break; // elvileg ez megakadályozza a beszorulást
          } else {
            // a második paraméter a hangyától jöjjön!
            let avoidanceDirection = obstacle.getAvoidanceDirection(ant.pos, 
                                                    10)
            if (!(avoidanceDirection.x==0 && avoidanceDirection.y==0)) {
              ant.evadeObstacle(avoidanceDirection);
            } 
          }    
        }
      }
    }
  }
  
  
//   obstacleHandling() {
      // old flee based version -- not working properly
//     // let testPoint = this.map.obstacles[0].closestPointToAvoid(createVector(mouseX, mouseY));
//     // fill(color(0,255,0))
//     // circle(testPoint.x, testPoint.y, 5)
    
    
//     // ez még nem igazán működik, ezért ki van kapcsolva
//     for (let antHill of this.map.antHills) {
//       for (let ant of antHill.ants) {     
//         let projectedPoses = [
//                              ant.getProjectedPos(8),
//                              ant.getProjectedPos(10),
//                              ant.getProjectedPos(20),
//                              // ant.getProjectedPos(20),
//                              ];
//         let projectedPos = ant.getProjectedPos(20);
        

//         // elvileg működik, gyakorlatilag viszont valami nem jó a logikával
//         for (let obstacle of this.map.obstacles) {
//           if (obstacle.contains(ant.pos)) {
//             ant.avoidTarget(obstacle.posCenter)
//           } else {
//             // for (let projectedPos of projectedPoses) {
//               if (obstacle.contains(projectedPos)) {
//                 fill(color(0,0,0))
//                 // circle(obstacle.closestPointToAvoid(ant.pos).x, obstacle.closestPointToAvoid(ant.pos).y, 5)
//                 // ant.avoidTarget(obstacle.closestPointToAvoid(ant.pos));
//                 ant.avoidTarget(obstacle.posCenter)
//                 // break;
//               } 
//             // }
//           }    
//         }
        
//       }
//     }
//   }
    

  
  pheromoneMovement() {
    for (let antHill of this.map.antHills) {
      for (let ant of antHill.ants) {
        let targetPheromoneType = 'return';
        if (ant.hasFood) {targetPheromoneType = 'wander'}
        for (let pheromone of antHill.pheromones) {
          if (pheromone.type == targetPheromoneType & ant.isSeen(pheromone.pos)) {
            ant.adjustPheromoneDirection(pheromone.pos)
          }
        }
      }
    }
  }
  
  
  updateInfoTable() {
    let infoList = [
                    {'name': 'FPS', 'value':   Math.round(frameRate())},
                    {'name': 'simStep', 'value': this.simStep}
                    ]
    this.infoTable.update(this.simStatPos, infoList);
  }
  
  
    
  display() {
    this.map.display()
    this.infoTable.display()
  }
}