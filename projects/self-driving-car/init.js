// fitness
let slownessPenalty = 0.5;
let fastnessReward = 2


// genetic settings
let mutationRate = 0.2; // with 0.2 value a finisher car will emerge in 10-20 gen, after that it will speed up
let popSize = 10; // 10-nél több sajnos jelenleg nagyon lassú


// sim settings
let SKIPNGEN = 0; // You can skip even 100 gen, but it could take a while. Try skip only 10-20 gen as it only takes 2-5 min. Warning, if the browser window is not in the foreground, the calculation will stop!
let simSpeed = 1; // speeds up simulation (unfortunately the simulation currently too calculatin heavy to take effect), use skipgen instead as that skips the drawing step
let showParentText = 1; // show ancestor on car


// you should not change values below this row studying the codes

// car settings
let carWidth = 40;
let carHeight = 20;
let carMinSpeed = 0.8; // no reverse or stop
let carDirectSteeringSpeed = 0.04;
let carDirectSpeedChangeMagnitude = 0.2;
let carNaxSpeed = 3;

// fail safes - 
let GENERATIONS = 1000; // it prevents from running forever
let maxSimLength = 3000; // it kills the population if lasts too long (e.g. stucked)

// map settings
let start = [470, 100] // if you would like to use other map, or start from elsewhere
let STARTANGLE = 0.0; // if you change the start pos, correct it as well

// the order of these matter!
  // the first should be the first one after the start
  // after that this should be in order
// if you load another map, you have to manually fill this list with your checkpoints
let checkpointList = [
  [550, 40, 550, 140],
  [650, 180, 750, 120],
  [670, 240, 770, 270],
  [600, 250, 600, 350],
  [430, 380, 530, 380],
  [620, 410, 620, 510],
  [610, 510, 610, 610],
  [480, 510, 480, 610],
  [250, 500, 340, 500],
  [230, 400, 320, 350],
  [100, 380, 100, 480],
  [10, 300, 110, 300],
  [70, 60, 130, 150],
  [170, 40, 170, 140],
  [300, 40, 300, 140],
  [400, 40, 400, 140],
]


// global variables
let population;
let carPicture;
let testText;
let track;
let trackPicture;
let START_POINT;
let trackBuilder;


// user inputs
// window.doubleClicked = (e) => trackBuilder.doubleClicked();
window.mousePressed = (e) => trackBuilder.mousePressed();

window.keyPressed = (e) => (trackBuilder.keyPressed())




