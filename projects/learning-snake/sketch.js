// √ állítsd át, hogy az almát is ugyanúgy lássa, mint a többi dolgot
  // √ valószínűleg a gyenge látás logika miatt akad meg így 4-6 almánál
// √ mérj átlag almát is a következő hosszabb futtatás előtt!
// √ nézz utána mégegyszer a rulette wheel kiválasztásnak
  // √ biztos, hogy a nagy számú gyengének ilyen magas számban jelen kell lennie a következő generációban?
// Tedd bele mégis a crossovert

const BOARDSIZE = [8, 8]
const CELLSIZE = [10,10]
const POPSIZE = 300 // elvileg működik többel, csak nem sokat jelez ki...

let popCnt = 0
let stat = []

let population
let snakeGameVises = []
let nSnakesToVis = 49 // jelenleg random választom ki őket
let SNAKENUMSTOVIS = []

// tickers
let stepRate = 1 // snake step rate
let totalFrames = 0


let nn1
let nn2
let newChild

function setup() {
  createCanvas(700, 700).parent('sketch');
  for (let i=0; i<nSnakesToVis;i++) {
    let visRows = floor(math.sqrt(nSnakesToVis))
    let xShift = math.floor(i / visRows)
    let yShift = i % visRows
    snakeGameVises.push(new SnakeGameVis(createVector(10 + xShift*(BOARDSIZE[0]+1)*CELLSIZE[0], 10+yShift*(BOARDSIZE[1]+1)*CELLSIZE[1]), 
                                         BOARDSIZE, CELLSIZE))
  }

  // print(population.agents[0].agent)
  
//   nn1 = new NeuralNetwork([4,3,2])
//   nn2 = new NeuralNetwork([4,3,2])
//   newChild = nn1.crossover(nn2)
  
  
//   print('nn1', nn1.weightTables[1]._data)
//   print('nn2', nn2.weightTables[1]._data)

//   print('child', newChild.weightTables[1]._data)

  ProjectPage.connect({
    applySettings(settings) {
      stepRate = settings.stepRate
    },
    restart: restartSimulation,
  })
}

function restartSimulation(settings) {
  stepRate = settings.stepRate
  popCnt = 0
  totalFrames = 0
  stat = []
  SNAKENUMSTOVIS = Array.from({ length: nSnakesToVis }, () => Math.floor(Math.random() * POPSIZE))
  population = new Population(POPSIZE, SnakeAgent, [BOARDSIZE])
  resetChart(scoreChart)
  showGenerationStats()
}

function showGenerationStats() {
  const readout = document.getElementById('generation-readout')
  if (popCnt === 0) {
    readout.textContent = 'No generation has finished yet.'
    return
  }
  readout.textContent = `Generation ${popCnt}: best score ${population.maxScore}, ` +
    `average score ${population.avgScore.toFixed(2)}, ` +
    `average fitness ${Math.round(population.avgFitness)}.`
}

function draw() {
  background(220);
  let currentSnakeGame = population.agents[0].agent
  for (let i=0; i<nSnakesToVis;i++) {
    let snakeGameVis = snakeGameVises[i]
    let snakeNum = SNAKENUMSTOVIS[i]
    snakeGameVis.display(population.agents[snakeNum].agent.snake,
                         population.agents[snakeNum].agent.applePos)
  }
  
  if (totalFrames % stepRate == 0) {
    if (population.populationNotDone) {
      population.update()
    } else {
      popCnt++
      population.calculateFitnesses()
      addData(scoreChart, popCnt, [population.maxScore, population.avgScore, population.avgFitness])
      showGenerationStats()

      // print(popCnt,  
      //       population.maxScore,
      //       population.avgScore,
      //       population.maxSteps,
      //       population.avgSteps,
      //       math.round(population.maxFitness), 
      //       math.round(population.avgFitness)
      //      )
      stat.push([popCnt,  population.maxScore, population.maxFitness, population.avgFitness])
      population = new Population(POPSIZE, SnakeAgent, [BOARDSIZE], population)
    }
  }
  
  totalFrames++
}





function keyPressed(event) {
  // Keep the shortcuts away from native controls, buttons, and links.
  if (event && event.target instanceof Element &&
      event.target.closest('input, select, textarea, button, a[href]')) {
    return
  }
  // manuális teszteléshez ENTER: 1-es kígyó lépjen egyet
  let currentSnakeGame = population.agents[0]
  if (keyCode === LEFT_ARROW) {
    currentSnakeGame.update(0)
  } else if (keyCode === RIGHT_ARROW) {
    currentSnakeGame.update(2)
  } else if (keyCode === UP_ARROW) {
    currentSnakeGame.update(1)
  } else if (keyCode === ENTER) {
    population.update()
  }
}


