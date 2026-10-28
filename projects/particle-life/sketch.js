let displaySim = 1;

let GRIDSUBDIVS = 12;
let n_cells = 100;


let cells;
let uniformGridSpace;
let infoTable;
let nCollCheck = 0;
let nGroups = 6 // max 6

let connectionStrengthMatrix
let canvas

function setup() {
  canvas = createCanvas(1000, 600);
  canvas.parent('sketch');

  infoTable = new InfoTable(createVector(10,10), []);
  
  initControlPanel()
  ProjectPage.connect({
    applySettings: applyControlSettings,
    restart: regenerateCells,
  });
  describe("Six groups of particles interacting on a black canvas, wrapping at its edges. The overlay shows FPS and cell count.");
}



function draw() {
  background(0);
  uniformGridSpace = new UniformGridSpace(createVector(width, height), GRIDSUBDIVS);
  // uniformGridSpace = new RTree(10, 20)
  
  for (let cell of cells) {
    cell.update();
    uniformGridSpace.insert(cell, cell.pos, cell.radius);
    // uniformGridSpace.insert([cell.pos.x, cell.pos.y, cell.radius], cell);
  }
  
  
  for (let cell of cells) {
    closeCells = uniformGridSpace.queryRangeCircle(cell.pos, cell.attractionDistance)
    for (let closeCell of closeCells) {
      cell.interact(closeCell, connectionStrengthMatrix)
    }
  }
  

  
  // display
  if (displaySim) {
    // uniformGridSpace.display()

    for (let cell of cells) {
      cell.display();
    }
  }

  
  infoTable.update(createVector(10,10), 
                   [{'name': 'FPS', 'value':   Math.round(frameRate())},
                    {'name': 'nCells', 'value':   cells.length}
                    ])
  infoTable.display();
}




// ezeket még rendezni kell
function regenerateCells() {
  // Clear the current list of cells
  cells = [];
  
  // Create new cells and add them to the list
  for (let i = 0; i < n_cells; i++) {
    let pos = createVector(random(width), random(height));
    let groupNum = floor(random(nGroups));
    cells.push(new Cell(pos, groupNum));
  }
}




