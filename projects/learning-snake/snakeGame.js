// √ (egyelőre) fejezd be a snake agentet
// √ hozd be a neurális hálót a kódba
// √ vizsgáld felül a SnakeGame-t, pár dolgot át kell nevezni/írni
// √ (egyelőre) írd át a population kódot ott, ahol kell, hogy a SnakeAgenttel is működjön
// √ az nn classba kell két metódus
  // √ COPY - ezzel folytasd!
  // √ mutate
  // √ crossover - ez most nem kell, de hasznos lenne egy ilyen is!
// √ új verzióban írd újra nulláról a sketch fájlt
  // √ használja a population-t és csak random rajzoljon egy snaket, vagy egyszerre az összeset akár
//  √ próbáld ki, elvileg innentől kezdve már tanul

// dolgozd ki a GUI-t

class SnakeAgent {
  constructor(boardSize) {
    let checkDiagonals = true //false
    let layerSizes = []
    if (checkDiagonals){
    //   layerSizes = [18, 36, 36, 8, 3]
    // } else {
    //   layerSizes = [10, 20, 20, 10, 3]
      layerSizes = [24, 16, 16, 3]
    } else {
      layerSizes = [12, 8, 4, 3]
    }
    this.agent = new SnakeGame(boardSize)
    this.brain = new NeuralNetwork(layerSizes)
    this.snakeVision = new SnakeVision(boardSize, checkDiagonals = checkDiagonals)
    
    this.score = 0
    this.fitness = 0
    this.isAlive = 1 // not dead
    this.isFinished = 0 // won
    
  }
  
  update() {
    let vision = this.snakeVision.getVision(this.agent.snake, 
                                            this.agent.lastDirection,
                                            this.agent.applePos)
    let totalVision = [].concat(vision.distWalls, vision.distTails, vision.distApples)
    let brainOutput = this.brain.predict(totalVision)
    let directionIndex = this.brainOutputToDirectionIndex(brainOutput)
    // a lenti törölhető, csak manuális teszthez használom
    // if (testDirectionIndex) {
    //   this.agent.update(testDirectionIndex)
    // } else {
    //   this.agent.update(directionIndex)
    // }
    
    this.agent.update(directionIndex)

    
    this.score = this.agent.cntApples
    this.steps = this.agent.cntSteps // lehet, hogy törlendő
    this.isAlive = this.agent.isAlive
    this.isFinished = this.agent.isFinished
  }
  
  setBrain(nn) {
    // deep copy
    this.brain = nn.copy()
  }
  
  brainOutputToDirectionIndex(brainOutput) {
    // direction indexes: 0: left, 1: forward, 2: right
    let directionIndex = brainOutput.indexOf(math.max(...brainOutput));
    return directionIndex
  }
  
  // calculateFitness() {
  //   // ez még kidolgozandó!
  //   let fitness = 0
  //   if (!this.agent.loopFail) {
  //     fitness = this.agent.cntSteps + (this.agent.cntApples * 50)
  //   } 
  //   // fitness = this.agent.cntApples // only apple based reward
  //   this.fitness = fitness
  //   return fitness
  // }
  
  calculateFitness() {
    let fitness = 0
    let steps = this.agent.cntSteps
    let score = this.agent.cntApples
    let scoreMultiplier = 500
    let stepMultiplier = 0.25
    let hadMultiDirection = this.agent.hadMultiDirection() 
    let hadMultiDirectionMultiplier = 1
    if (!this.agent.loopFail) {
      // fitness = steps + score*50 + ((score**2)/steps)*1000
      // fitness = steps + ((score**2)/steps)*1000
      fitness = steps+(2**score+score**2.5*scoreMultiplier)-(score**1.2*(stepMultiplier*steps)^1.8)
      // print(steps, score, ((score**2)/steps)*1000, ((score**2)/steps), (score**2), 0/steps)
    } 
    fitness = max(0, fitness)
    if (hadMultiDirection) {fitness = fitness*hadMultiDirectionMultiplier}
    // fitness = this.agent.cntApples // only apple based reward
    this.fitness = fitness
    return fitness
  }
  
}


class SnakeGame {
  constructor(boardsize) {
    this.rows = boardsize[0]
    this.columns = boardsize[1]
    // a kezdő állapotot dinamikusan kellene meghatározni
      // xStart, yStart -> csak teszteléshez használt változó legyen!
    // this.snake = [[xStart, yStart], [xStart-1, yStart], [xStart-2, yStart]]
    this.xStart = 1 + math.floor(math.random() * (this.rows - 2)) 
    this.yStart = 1+ math.floor(math.random() * (this.columns - 2))
    this.initialLength = 3
    this.snake = [[this.xStart, this.yStart]]
    
    let possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    this.lastDirection = possibleDirections[math.floor(math.random() * possibleDirections.length)] //ezt majd ne direktbe tegyük ide
    this.createApple()
    this.cntSteps = 0
    this.steps = [] // később ezzel mentem
    this.cntApples = 0
    this.isAlive = 1
    this.isFinished = 0
    this.stepSinceLastApple = 0 // ez Agent vagy SnakeGame szintű kellene legyen?
    this.previousDirectionIndexes = [1]
    this.loopFail = 0
  }
  
  update(directionIndex) {
    if (!this.isAlive) {return}
    if (this.isFinished) {return}
    this.previousDirectionIndexes.push(directionIndex) //mentéshez és csekkoláshoz
    let direction = this.directionIndexToDirection(directionIndex)
    this.move(direction)
    this.stepSinceLastApple++
  }
  
  move(direction) {
    if (!this.isAlive) {return}
    if (this.isFinished) {return}
    let newSnakeHead = math.add(this.snake[0], direction)
    if (math.deepEqual(math.add(this.lastDirection, direction), [0,0])) {return}
    
    if (this.failCheck(newSnakeHead)) {return}
    this.snake.unshift(newSnakeHead)
    if (math.deepEqual(newSnakeHead, this.applePos)) {
      if (this.hasWon()) {return}
      this.createApple()
      this.cntApples++
      this.stepSinceLastApple = 0
    } else {
      if (this.snake.length > this.initialLength) {
        this.snake.pop()
      }
    }
    this.lastDirection = direction
    this.steps.push([...direction])
    this.cntSteps++
  }
  
  directionIndexToDirection(directionIndex) {
    // direction indexes: 0: left, 1: forward, 2: right
    if (directionIndex==1) {return [...this.lastDirection]}
    if (directionIndex==0) {
      if (math.deepEqual(this.lastDirection, [1, 0])) {return [0, -1]}
      if (math.deepEqual(this.lastDirection, [0, -1])) {return [-1, 0]}
      if (math.deepEqual(this.lastDirection, [-1, 0])) {return [0, 1]}
      if (math.deepEqual(this.lastDirection, [0, 1])) {return [1, 0]}
    }
    if (directionIndex==2) {
      if (math.deepEqual(this.lastDirection, [1, 0])) {return [0, 1]}
      if (math.deepEqual(this.lastDirection, [0, 1])) {return [-1, 0]}
      if (math.deepEqual(this.lastDirection, [-1, 0])) {return [0, -1]}
      if (math.deepEqual(this.lastDirection, [0, -1])) {return [1, 0]}
    }
  }
                                                                   
  createApple() {
    let newApplePos
    while (true) {
      let validPos = true
      newApplePos = [Math.floor(Math.random() * this.rows), 
                     Math.floor(Math.random() * this.columns)]
      for (let snakeSegment of this.snake) {
        if (math.deepEqual(snakeSegment, newApplePos)) {
          validPos = false
        }
      }
      if (validPos) {break}
    }
    this.applePos = newApplePos
  }

  hasWon() {
    if (this.snake.length >= (this.rows*this.columns)) {
      this.isAlive = 1
      this.isFinished = 1
      // console.log("Win") // törlendő
      return true 
    }
    return false
  }

  failCheck(newSnakeHead) {
    // wall crash check
    if (newSnakeHead[0] < 0 || newSnakeHead[1] < 0 || 
        newSnakeHead[0] >= this.rows || newSnakeHead[1] >= this.columns
       ) {
      this.isAlive = 0
      return true
      // console.log("fail by wall") // törlendő
    }
    // self crash check
    for (let snakeSegment of this.snake) {
      if (math.deepEqual(snakeSegment, newSnakeHead)) {
        this.isAlive = 0
        return true
        // console.log("fail by self") // törlendő
      }
    }
    if (this.hasInfiniteLoopDeath()) {
      this.isAlive = 0
      this.loopFail = 1
      return true
    }
  }
    
  hasInfiniteLoopDeath() {
    if (this.stepSinceLastApple>((this.rows*this.columns)*2)) {return true}
    let maxOneDirectionMoveInARow = 4
    // infinite right or left 
    if (this.previousDirectionIndexes.slice(-maxOneDirectionMoveInARow).filter((DirectionIndex)=> DirectionIndex==2
                                                      ).length == maxOneDirectionMoveInARow) {return true } 
    if (this.previousDirectionIndexes.slice(-maxOneDirectionMoveInARow).filter((DirectionIndex)=> DirectionIndex==0
                                                      ).length == maxOneDirectionMoveInARow) {return true }
    return false
  }
    
  hadMultiDirection() {
    // checks whether turned at least x% to each directiondirectionCounts
    // TODO: ezt még lehetne bőven refaktorálni
    let targetRate = 0.05
    let directionCounts = {}
    let cntDirections = this.previousDirectionIndexes.length
    this.previousDirectionIndexes.forEach(e => directionCounts[e] ? directionCounts[e]++ : directionCounts[e] = 1 );
    let rateDirection0 = (directionCounts[0] || 0) / cntDirections
    let rateDirection1 = (directionCounts[1] || 0) / cntDirections
    let rateDirection2 = (directionCounts[2] || 0) / cntDirections

    let hadMultiDirection = rateDirection0 >= targetRate && 
                            rateDirection1 >= targetRate && 
                            rateDirection2 >= targetRate
    return hadMultiDirection
    // return [rateDirection0, rateDirection1, rateDirection2, hadMultiDirection, this.previousDirectionIndexes]
    // population.agents[0].agent.hadMultiDirection()
  }
}


class SnakeVision {
  constructor(boardsize, checkDiagonals = true) {
    this.width = boardsize[0]
    this.height = boardsize[1]
    this.checkDiagonals = checkDiagonals
  }
  
  getVision(snake, lastDirection, applePos) {
    // √ valószínűleg az irányításnál is figyelembe kell venni, hogy adott output node mindig relatív működjön a kígyóhoz képest EZ DÖNTŐ LEHET! (kész)
    let distWalls = []
    let distTails = []
    let distApples = []
    let directions = this.getDirections(lastDirection)
    for (let direction of directions) {
      let {distWall, distTail, 
           distApple} = this.getWallAndTailDist(direction, snake, applePos)
      distWalls.push(distWall)
      distTails.push(distTail)
      distApples.push(distApple)
    }
      
    return {"distWalls": distWalls, "distTails": distTails, "distApples": distApples}
  }
    
  getWallAndTailDist(direction, snake, applePos) {
    let snakeHead = snake[0]
    let x = snakeHead[0]
    let y = snakeHead[1]
    let distWall = 0
    let distTail = 0
    let distApple = 0
    let checkedSpot = snake[0]
    
    // loop the table from the snakehead to the closest edge along the current direction
      // check the closest tail and wall distance
    while (x>=0 && x<=this.width-1 && y>=0 && y<=this.height-1) {
      // check tail distance
      checkedSpot = math.add(checkedSpot, direction)
      if (distTail == 0) {
        for (let snakeSegment of snake) {
          if (math.deepEqual(snakeSegment, checkedSpot)) {
            distTail = distWall+1
            break
          }
        }
      }
      // check apple distance
      if (distApple == 0) {
        if (math.deepEqual(applePos, checkedSpot)) {
          distApple = distWall+1
        }
      }
        
      // "check" wall distance (increase distance)
      x += direction[0]
      y += direction[1]
      distWall++
    }
    if (distTail == 0) {
      distTail = math.max(this.width, this.height)+1
    }
    if (distApple == 0) {
      distApple = math.max(this.width, this.height)+1
    }
    return {distWall, distTail, distApple}
  }
  
  getDirections(lastDirection) {
    let directions = [[1,0], [0, 1], [-1,0], [0, -1]]
    let directionShiftAmt = this.getShiftFromDirection(lastDirection)
    arrayRotate(directions, directionShiftAmt) //makes the wall/tail distances relative to the lastDirection
    
    
    if (this.checkDiagonals) {
      let diagonalDirections = [[1,1], [-1, 1], [-1,-1], [1, -1]]
      arrayRotate(diagonalDirections, directionShiftAmt) //makes the wall/tail distances relative to the lastDirection
      directions = directions.concat(diagonalDirections)
    }
    return directions
  }
    
  getShiftFromDirection(direction) {
    if (math.deepEqual(direction, [1, 0])) {return 0}
    if (math.deepEqual(direction, [0, 1])) {return 1}
    if (math.deepEqual(direction, [-1, 0])) {return 2}
    if (math.deepEqual(direction, [0, -1])) {return 3}
  }
}



class SnakeGameVis {
  constructor(pos, boardSize, cellSize) {
    this.pos = pos
    this.boardSize = boardSize
    this.cellSize = cellSize
    this.boardColor = color(100, 180, 100)
    this.snakeColor = color(200, 200, 0)
    this.snakeHeadColor = color(230, 230, 0, 150)
    this.appleColor = color(230, 100, 50)
  }
  
  displayApple(applePos) {
    this.displayTile(applePos[0], applePos[1], this.appleColor)
  }
  
  displaySnake(snake) {
    let firstSegment = 1
    for (let snakeSegment of snake) {
      let snakeColor = this.snakeColor
      if (firstSegment) {
        snakeColor = this.snakeHeadColor
        firstSegment = 0
      }
      this.displayTile(snakeSegment[0], snakeSegment[1], snakeColor)
    }
  }
  
  displayBoard() {
    for (let i=0; i<this.boardSize[0]; i++) {
      for (let j=0; j<this.boardSize[1]; j++) {
        this.displayTile(i, j, this.boardColor)
      }
    }
  }
  
  displayTile(x, y, color) {
    push()
      translate(this.pos.x, this.pos.y)
      fill(color)
      stroke(120)
      rect(x*this.cellSize[0], y*this.cellSize[1], 
           this.cellSize[0], this.cellSize[1])
    pop()
  }
  
  display(snake, applePos) {
    this.displayBoard()
    this.displayApple(applePos)
    this.displaySnake(snake)
  }
}


