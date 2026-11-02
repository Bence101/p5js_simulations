// Hibák
  // jelenleg 1 füvet több nyúl is meg tud enni, azután is, hogy az eltűnt. Valahogyan eltárolódik a fű a nyulaknál duplikáltan.

// ötletek
  // először két tulajdonságot a legkönnyebb beletenni:
    // filed of view és mennyi kaja kell a szaporodáshoz, 3.: gyorsaság
    // kontroll sem kell első körben, az is szép, ha azt látjuk, hogy generációról generációra nő a FOV és csökken a min kaja szint

const DEFAULT_SETTINGS = Object.freeze({
  initialAgents: 100,
  initialGrass: 50,
  grassSpawnInterval: 10,
});

let lastEntityId = 0;
let ticker = 0;
let fr = 60;


let n_testAgents = DEFAULT_SETTINGS.initialAgents;
let testAgents = [];
let nInitGrass = DEFAULT_SETTINGS.initialGrass;

let grassList = [];
let grassSpawnTime = DEFAULT_SETTINGS.grassSpawnInterval;

function setup() {
  const myCanvas = createCanvas(600, 400);
  myCanvas.parent('sketch');
  myCanvas.elt.after(document.getElementById('population-chart'));
  frameRate(fr);
  ProjectPage.connect({
    canvas: myCanvas,
    defaults: DEFAULT_SETTINGS,
    applySettings,
    restart: restartSimulation,
  });
}

function applySettings(settings) {
  n_testAgents = settings.initialAgents;
  nInitGrass = settings.initialGrass;
  grassSpawnTime = settings.grassSpawnInterval;
}

function restartSimulation(settings) {
  applySettings(settings);
  testAgents = [];
  grassList = [];
  ticker = 0;
  lastEntityId = 0;

  for (let i = 0; i < n_testAgents; i++) {
    testAgents[i] = new Agent(createVector(random(0, width), random(0, height)));
  }

  for (let i = 0; i < nInitGrass; i++) {
    grassList[i] = new Grass(createVector(random(0, width), random(0, height)));
  }

  resetChart();
}

function draw() {
  background(220);


  
  // testAgents codes
  for (let i = testAgents.length-1; i >=0; i--) {
    testAgent=testAgents[i]
    
    // death check
    if (!testAgent.alive) {
      testAgents.splice(i, 1)
    }
    
    // offspring creation
    if (testAgent.createOffspring) {
      testAgents.push(new Agent(createVector(testAgent.pos.x+random(-50, 50), 
                                             testAgent.pos.y+random(-50, 50))));
      testAgent.createOffspring=0
    }
    
    // check for near grass
    if (testAgent.desire=='food') {
      for (let grass of grassList) {
        // print(grass)
        if (testAgent.pos.dist(grass.pos)<=testAgent.fieldOfView) {
          // egyelőre még csak közeli food
          testAgent.closestFood=grass;
          break;
        }
      }
    }

    testAgent.update();
    testAgent.display();
  }
  
  // grass codes
  for (let i = grassList.length-1; i >=0; i--) {
    grass=grassList[i]
    
    // eaten check
    if (grass.eaten) {
      grassList.splice(i, 1)
    }
    
    // grass.update(); // egyelőre nem kell semmiért updatelni
    grass.display();
  }
  // creating grass
  if (ticker%grassSpawnTime==0) {
    grassList.push(new Grass(createVector(random(0, width), random(0, height))));
  }

  
  // other codes
  if (ticker%fr==0) {
    addData(chart, ticker, [testAgents.length, grassList.length])
  }
  
  ticker+=1;
}






