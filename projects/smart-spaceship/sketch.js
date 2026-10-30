// Leírás:
  // a háromszögek űrhajókat/egereket/agenteket jelképeznek
  // a céljuk, hogy elérjék a zöld célt
  // kiindulunk egy populációnyi random agentből
  // ha a populáció életideje lejárt, akkor az agentek szaporodnak és átörökítik a gén állományukat
  // a trükk, hogy minél jobban teljesített valaki, annál nagyobb eséllyel fog szaporodni
  // még van pár apróság, de lényegében ezzel a logikával néhány generáció alatt meg tudják találni a célt 
  // a színek a két szülőtől öröklődnek, így segítenek követni a sikeres génállományokat


// Feladatok, ötletek
  // kell egy simulation class, ami az egészet összecsomagolja
    // ez egyrészt parancsra végig futtathat 1 vagy több (akár az összes) szimulációt
    // másrészt egy függvénnyel elindíthat egy leszimulált szenáriót tetszőleges helyről (gen, lifetime)
  // kód refaktorálás
  // class szerepek, feladatok átgondolása
  // új classok: genes
  // ezután a haladó funkciók beépítése
    // pörgetés, háttérben futás, első sikeres űrhajótól mutassa csak
      // emelje ki a generáció legjobbját
    // rajzolható akadály
    // GUI (a konstansok vezérlése), generáció ugrás stb.
    // tegyél a fitness függvénybe gyorsaságot jutalmazó/büntető logikát (deaktiválva benne van)
  // there are other hard coded constants that are not yet listed here
  // some logic like killer walls needs switches
  // a színek és a mozgás mutációját össze lehetne kötni, hogy egyszerre történjenek


// paraméterezési ötletek
  // POPSIZE = 10-20, alsó akadály kikommentelve
    // ezzel a beállítással szépen követhető, ahogy egyes színek előtörnek,
      // majd mutálódnak és a mutációk is erősödnek


// global meta parameters to calibrate
  // general options
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const DEFAULTS = Object.freeze({ simSpeed: 1 });

let GENERATIONS  = 200;
let POPSIZE = 100;
let MUTATION_RATE = 0.002;
let FINISH_DIST = 30; // size of the target
let GENETRACINGBYCOLOR=true; // interesting gene tracing
let SKIPNGEN = 0; // skip the first N generation (0-GENERATIONS)
let SIMSPEED = DEFAULTS.simSpeed;
let AGENTSPEED = 2; // change only with the LIFETIME
  // fitness options
let BASEDEATHPENALTY = 1; // <1 for penalty!   1 for no penalty
let QUICKDEATHPENALTY = 0; // <1 for penalty!  0 for no penalty
let BASEFINISHREWARD = 0; // 0 for no reward (0-10)
let QUICKFINISHREWARD = 0; // 0 for no reward (0-10)
  // COLORINGAPPROACH options: 
    // 'average' // colors blend soon
    // 'component mix' // works well for small popsize e.g. 10-50
let COLORINGAPPROACH = 'component mix';

let DRAWMAPMODE = 1; // lets you draw the map during simulation



// object containers, other global variables
let currentGen = 0;
let population;
let level;

// these are initialized later but used as constants afterwards
let LIFETIME;
let START_POINT;
let TARGET;

// other variables


function setup() {
  const myCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  myCanvas.parent("sketch");
  myCanvas.elt.setAttribute("role", "img");
  myCanvas.elt.setAttribute("aria-label", "Simulation canvas with colored triangular ships navigating gray obstacles toward a green target.");

  const generationChart = document.getElementById("generation-chart");
  if (!(generationChart instanceof HTMLElement)) {
    throw new Error("The generation chart is missing from the project page.");
  }
  myCanvas.elt.parentElement.appendChild(generationChart);

  
  START_POINT= createVector(width/2, height-height/5);
  TARGET = createVector(width/2, height/10);
  createHUD();

  ProjectPage.connect({
    canvas: myCanvas,
    defaults: DEFAULTS,
    applySettings(settings) {
      SIMSPEED = settings.simSpeed;
    },
    restart: restartSimulation
  });
}

function restartSimulation() {
  currentGen = 0;
  SKIPNGEN = 0;
  firstPos = undefined;
  secondPos = undefined;
  level = createAdvancedLevel();
  LIFETIME = level.recommendedLifetime;
  population = new Population(POPSIZE, LIFETIME, TARGET);
  resetPerformanceChart();
  loop();
}

function draw() {
  background(220);
  for (let i = 0; i < SIMSPEED; i++) {

    // updating population (e.g. moving agents based on their genes)
    population.update(level.obstacles);

    // checking for the end of a population
    if (population.age>=population.lifetime) {
      population.calculateFitnesses();

      // updating the chart with this populations performance
      addData(performanceChart, currentGen, [population.deathRate, 
                                  1-population.deathRate-population.finisherRate,
                                  population.finisherRate])

      // creating new population from the previous generation
      population = new Population(population.popSize, LIFETIME, TARGET, population);
      
      // level making support
      firstPos=undefined;
      secondPos=undefined;
      
      currentGen++;
      if (currentGen>=GENERATIONS) {
        print('The simulation finished!')
        noLoop();
        break;
      }      
    }
    
    // this freezes the loop until desired generation is not reached
    if (currentGen<SKIPNGEN) {
      i-=1;
    }
  }

  if (firstPos && secondPos && DRAWMAPMODE) {
    let x = Math.min(firstPos.x, secondPos.x);
    let y = Math.min(firstPos.y, secondPos.y);
    let w = Math.abs(firstPos.x-secondPos.x);
    let h = Math.abs(firstPos.y-secondPos.y);
    
    if (w>=5 && h>=5) {
      level.addObstacle(x, y, w, h);
    }
    
    firstPos=undefined;
    secondPos=undefined;
    // levelParameters=createP('sdf')
    // print(level)
  }
  
  // displaying level (obstacles)
  level.display()
  
  
  
  
  // displaying population
    // out of SIMSPEED loop to avoid bluring
  population.display();

  // displaying target
  fill(color(100, 255, 100));
  stroke(color(100, 200, 100));
  circle(TARGET.x,TARGET.y, FINISH_DIST*2);

  // displaying current generation
  fill(color(100, 100, 255));
  noStroke();
  textSize(20);
  text("Gen: " + currentGen,20, 40)

}
