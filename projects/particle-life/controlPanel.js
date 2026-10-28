let newCellGroupDecider = 0
let colorChooser
let nNewCellsSlider
let brushSizeSlider
let colorList = ["random", "red", "green", "blue", "yellow", "purple", "orange"];
let mouseFunction = "create";




function initControlPanel() {
  
  connectionStrengthMatrix = createMatrix(nGroups, 1)

  createMatrixButtons(connectionStrengthMatrix)
  
  
  let regenerateMatrixButton = createButton("Regenerate matrix").mousePressed(regenerateMatrix);
  regenerateMatrixButton.addClass("control-panel-button");
  regenerateMatrixButton.position(0,10)
  regenerateMatrixButton.parent('button-container')
  
  let regenerateCellsButton = createButton("Regenerate All Cells").mousePressed(regenerateCells);
  regenerateCellsButton.addClass("control-panel-button");
  regenerateCellsButton.position(0,50)
  regenerateCellsButton.parent('button-container')

  
  
  colorChooser = createSelect();
  colorChooser.parent('button-container')
  colorChooser.position(100, 10);
  for (let i = 0; i < nGroups+1; i++) {
    colorChooser.option(colorList[i]);
  }
  colorChooser.changed(changeCellColor);
  
  
  
  nNewCellsSlider = createSlider(1, 30, 10);
  nNewCellsSlider.parent('button-container')
  nNewCellsSlider.position(200, 10);
  
  
  
  brushSizeSlider = createSlider(0, 100, 50);
  brushSizeSlider.parent('button-container')
  brushSizeSlider.position(200, 40);
  
  
  createMouseFunctionRadio()
}


function createMouseFunctionRadio() {
  let radio = createRadio();
  radio.option("create", "create cells");
  radio.option("delete", "delete cells");
  radio.selected('create');
  radio.parent('button-container')
  radio.position(340, 10);
  
  radio.changed(function() {
    mouseFunction = this.value();
  });
}


function mousePressed() {
  if (!brushSizeSlider || !nNewCellsSlider || !cells || !isMouseOnCanvas()) {
    return;
  }
  if (mouseFunction === "create") {
    createCellsInCircle(mouseX, mouseY, brushSizeSlider.value());
  } else if (mouseFunction === "delete") {
    removeCellsInCircle(mouseX, mouseY, brushSizeSlider.value());
  }
}

function isMouseOnCanvas() {
  return (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height);
}


function changeCellColor() {
  newCellGroupDecider = colorList.indexOf(colorChooser.value());
}


function createCellsInCircle(x, y, r) {
  n = nNewCellsSlider.value()
  if (!isMouseOnCanvas()) {return}
  for (let i = 0; i < n; i++) {
    let angle = random(TWO_PI);
    let distFromPos = random(r);
    let pos = createVector(x + distFromPos * cos(angle), y + distFromPos * sin(angle));
    
    //newCellGroupDecider: 0 = random, 1,2,3... colors
    if (newCellGroupDecider == 0) {
      let colorIndex = Math.floor(random(0, nGroups))
      cells.push(new Cell(pos, colorIndex));
    } else {
      cells.push(new Cell(pos, newCellGroupDecider-1));
    }
  }
}
  
function removeCellsInCircle(x, y, r) {
  for (let i = cells.length-1; i >= 0; i--) {
    let d = dist(cells[i].pos.x, cells[i].pos.y, x, y);
    if (d < r) {
      cells.splice(i, 1);
    }
  }
}

