class Board {
  constructor(owner) {
    this.owner = owner;
    this.settings = this.owner.settings;
    
    // board object lists
    this.obstacles = [];
    
    this.size = [this.settings.board.boardWidth, 
                 this.settings.board.boardHeight]
    this.color = color(220,220,220, 40)
    this.initBoard()
  }
  
  saveBoard() {
    let boardDict = {'boardWidth': this.settings.board.boardWidth,
                     'boardHeight': this.settings.board.boardHeight,
                     'obstacles': []
                    }
    for (let obstacle of this.obstacles.slice(4)) {
      let obstacleDict = {
        'x': obstacle.posStart.x,
        'y': obstacle.posStart.y,
        'w': obstacle.width,
        'h': obstacle.height
      }
      boardDict.obstacles.push(obstacleDict)
    }
    const output = document.getElementById("board-json-output");
    const status = document.getElementById("board-json-status");
    if (!(output instanceof HTMLTextAreaElement) || !status) {
      throw new Error("The accessible board JSON output is missing from the project page.");
    }
    output.value = JSON.stringify({ board: boardDict }, null, 2);
    status.textContent = "Board JSON updated. Select the text to copy it.";
  }
  
  createSavedObstacles() {
    for (let obstacle of this.settings.board.obstacles) {
      this.addObstacle(createVector(obstacle.x, obstacle.y), 
                          [obstacle.w, obstacle.h], 
                          this.settings);
      this.obstacleId++;
    } 
  }
  
  
  initBoard() {
    this.createBorderObstacles();
    this.createSavedObstacles();
  }
  
  
  addObstacle(startPoint, size, settings) {    
    const obstacle = new Obstacle(startPoint, size, settings);
    this.obstacles.push(obstacle);
    return obstacle;
  }
    
  removeObstacle(pos, all = false) {
    for (let i = this.obstacles.length-1; i>=0; i--) {
      if (this.obstacles[i].onIt(pos)) {
        this.obstacles.splice(i, 1)
        if (!all) {return}
      }
    }
  }
  
  createBorderObstacles() {
  let obsThickness = 80;
  let offset = 10;
  let boardWidth = this.settings.board.boardWidth;
  let boardHeight = this.settings.board.boardHeight;

  // (posStart, width, height, properties, id)
  let obsCoordinates = [
          [-obsThickness, -obsThickness, 
             boardWidth+obsThickness*2, obsThickness+offset],
          [-obsThickness, -obsThickness, 
             obsThickness+offset, boardHeight+obsThickness*2],
          [-obsThickness, boardHeight-offset, 
             boardWidth+obsThickness*2, obsThickness+offset],
          [boardWidth-offset, -obsThickness, 
             obsThickness+offset, boardHeight+obsThickness*2]
  ]
    
    for (let coordinate of obsCoordinates) {
      this.addObstacle(createVector(coordinate[0], coordinate[1]), 
                          [coordinate[2], coordinate[3]], 
                          this.settings);
      this.obstacleId++;
    } 
  }
  
  displayBoard() {
    push();
      noStroke();
      fill(this.color);
      rect(0,0, this.size[0], this.size[0]);
    pop();
  }
  
  display() {
    this.displayBoard();
    this.obstacles.forEach((object) => object.display());

  }
}
  
  
  
class BoardManipulator {
  // ráfér az egész osztályra egy refaktorálás, a globál változókat is ki kellene venni!
  constructor() {
    this.mousePosList = [];
  }
  
  startNewObstacle(mouseX, mouseY, mouseButton) {
    if (!isLooping()) {return undefined}
    if (mouseButton != LEFT) {return undefined}
    if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {
      this.mousePosList = [];
      return undefined
    }
    let viewZoom = viewTransformerControls.view.zoom;
    let viewX = viewTransformerControls.view.x;
    let viewY = viewTransformerControls.view.y;
    let mouseXCorrected = mouseX-viewX
    let mouseYCorrected = mouseY-viewY

    this.mousePosList.push(createVector(mouseXCorrected, mouseYCorrected));
    if (this.mousePosList.length > 1) {
      this.mousePosList = [];
    }
  }
  
  endNewObstacle(mouseX, mouseY, mouseButton) {
    if (!isLooping()) {return undefined}
    if (mouseButton != LEFT) {return undefined}
    if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {
      this.mousePosList = [];
      return undefined
    }
    let viewZoom = viewTransformerControls.view.zoom;
    let viewX = viewTransformerControls.view.x;
    let viewY = viewTransformerControls.view.y;
    if (this.mousePosList.length == 1) {
      this.mousePosList.push(createVector(mouseX-viewX, mouseY-viewY))
      if (this.mousePosList[0].dist(this.mousePosList[1]) == 0) {
        this.mousePosList = [];
        return undefined
      }
      let nextWidth = this.mousePosList[1].x - this.mousePosList[0].x
      let nextHeight = this.mousePosList[1].y - this.mousePosList[0].y
      if ((nextWidth>0) && (nextHeight>0)) {
        const obstacle = simulation.board.addObstacle(this.mousePosList[0],
                                                      [nextWidth, nextHeight],
                                                      SETTINGS);
        obstacle.userCreated = true;
      }
    }
    this.mousePosList = [];
    
  }
  
  removeObstacle(mouseX, mouseY, mouseButton) {
    if (!isLooping()) {return undefined}
    if (mouseButton != LEFT) {return undefined}
    if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {
      this.mousePosList = [];
      return undefined
    }
    let viewZoom = viewTransformerControls.view.zoom;
    let viewX = viewTransformerControls.view.x;
    let viewY = viewTransformerControls.view.y;
    let mousePos = createVector(mouseX - viewX, mouseY - viewY);
    
    simulation.board.removeObstacle(mousePos);
    this.mousePosList = [];
  }
  
  display(mouseX, mouseY) {
    if (this.mousePosList.length == 1) {
      let viewX = viewTransformerControls.view.x;
      let viewY = viewTransformerControls.view.y;
      let firstPos = this.mousePosList[0].copy();
      firstPos.x = firstPos.x + viewX
      firstPos.y = firstPos.y + viewY
      let width = mouseX - firstPos.x 
      let height = mouseY - firstPos.y
      if ((width>0) && (height>0)) {
        push();
          fill(color(170, 170, 170));
          stroke(color(70, 70, 70));
          rect(firstPos.x, firstPos.y, width, height)
        pop();
      }
    }
  }
}