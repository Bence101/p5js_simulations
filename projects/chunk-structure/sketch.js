let displaySim = 1;

let GRIDSUBDIVS = 8;
let checkCollisions = 1;
let n_cells = 200;
let n_mover = 20;


let cells;
let movers;
let uniformGridSpace;
let mousePoint;
let infoTable;
let nCollCheck = 0;
let nFrame = 0;



function setup() {
  createCanvas(800, 600);
  infoTable = new InfoTable(createVector(10,10), []);

  cells = [];
  movers = []

  mouseCell = new Cell(createVector(mouseX, mouseY), color(200, 0,0));
  mouseCell.radius = 15;
  
  for (let i = 0; i < n_cells; i++) {
    cells[i] = new Cell(createVector(random(0, width), random(0, height)));
  }
  
  for (let i = 0; i < n_mover; i++) {
    movers[i] = new Cell(createVector(random(0, width), random(0, height)),
                                       color(200, 100, 100, 200));
  }
}




function draw() {
  nFrame++;
  background(220);
  uniformGridSpace = new UniformGridSpace(createVector(width, height), GRIDSUBDIVS);
  mouseCell.pos = createVector(mouseX, mouseY);
  mouseCell.update();
  
  for (let cell of cells) {
    // mouseCell.isSeen(cell.pos);
    cell.update();
    uniformGridSpace.insert(cell, cell.pos, cell.radius);
  }
  // uniformGridSpace.insert(mouseCell, mouseCell.pos, mouseCell.radius);
  
  
  for (let mover of movers) {
    mover.randomMove(5);
    if (checkCollisions) {
      cellsToCheck = uniformGridSpace.queryRangeCircle(mover.pos,
                                                        mover.radius)
      for (let cell of cellsToCheck) {
        cell.tested = 1;
        cell.isSeen(mover.pos, mover.radius);
        nCollCheck+=1;
      }
    }
  }
  
  
  // mouse check
  cellsToCheck = uniformGridSpace.queryRangeCircle(mouseCell.pos,
                                                    mouseCell.radius)
  for (let cell of cellsToCheck) {
    cell.tested = 1;
    cell.isSeen(mouseCell.pos, mouseCell.radius);
    nCollCheck+=1;
  }
  
  // display
  if (displaySim) {
    uniformGridSpace.display()

    for (let cell of cells) {
      cell.display();
    }
    for (let mover of movers) {
      mover.display();
    }  
  }

  mouseCell.display();
  
  infoTable.update(createVector(10,10), 
                   [{'name': 'nCollCh', 'value':   Math.round(nCollCheck/1000)},
                    {'name': 'FPS', 'value':   Math.round(frameRate())}
                    ])
  infoTable.display();
}






