class UniformGridSpace {
  constructor(size, nSubdivisions) {
    this.size = size;
    this.spacerX = size.x/nSubdivisions;
    this.spacerY = size.y/nSubdivisions;
    this.nSubdivisions = nSubdivisions;
    this.createEmptyGrid();
  }
  
  createEmptyGrid() {
    this.grid = []
    
    for (let x = 0; x < this.nSubdivisions; x++) {
      this.grid[x] = []; // create nested array
      for (let y = 0; y < this.nSubdivisions; y++) {
        this.grid[x][y] = [];
      }
    }
  }
  
  insert(object, pos, w, h, tag) {
    // object, pos, w (r), h, tag
    // this.processPoint(object, pos);
    this.processCircle(object, pos, w);
  }
  
  queryRangeCircle(queryPos, queryRadius) {
    let gridPoses;
    let objArray = [];
    let tmpNewObjArray = [];
    gridPoses = this.circleToGridIndexes(queryPos, queryRadius);
    let alreadyIn = 0;
    
    for (let gridPos of gridPoses) {
      tmpNewObjArray = this.grid[gridPos.x][gridPos.y];
      
      for (let newObj of tmpNewObjArray) {
        alreadyIn = 0;
        for (let oldObj of objArray) {
          if (newObj==oldObj) {
            alreadyIn = 1;
          }
        }
        if (alreadyIn==0) {
          objArray.push(newObj);
        }
      }
    }
    return objArray;
  }
  
  
  processCircle(object, pos, r) {
    let gridPoses;
    gridPoses = this.circleToGridIndexes(pos, r);
    
    for (let gridPos of gridPoses) {
      this.grid[gridPos.x][gridPos.y].push(object);
    }
  }
      
  
  processPoint(object, pos) {
    let gridPos = this.pointToGridIndexes(pos)
    this.grid[gridPos.x][gridPos.y].push(object);
  }
    
  

  

  
  
  
  // display functions
  showGrid() {
    stroke(color(0, 0, 150, 150));
    strokeWeight(1);
    for (let x = 1; x < this.nSubdivisions; x += 1) {
      line(x * this.spacerX, 0, x * this.spacerX, this.size.y);
    }
    for (let y = 1; y < this.nSubdivisions; y += 1) {
      line(0, y * this.spacerY, this.size.x, y * this.spacerY);
    }
  }
  
  showNonEmptyCells() {
    for (let x = 0; x < this.nSubdivisions; x++) {
      for (let y = 0; y < this.nSubdivisions; y++) {
        if (this.grid[x][y].length) {
          let xLow = x*this.spacerX;
          let xHigh = (x+1) * this.spacerX;
          let yLow = y*this.spacerY;
          let yHigh = (y+1) * this.spacerY;
          noStroke();
          fill(color(0, 0, 150, 150));
          rectMode(CORNER);
          rect(xLow, yLow, this.spacerX, this.spacerY)
        } 
      }
    }
  }
  
  
  display() {
    this.showGrid()
    this.showNonEmptyCells()
  }
  
  
  // techical support functions
  circleToGridIndexes(pos, r) {
    let gridPos;
    let offsetVector;
    let xOffsets = [0, 1, 0, -1, 0];
    let yOffsets = [0, 0, 1, 0, -1];
    let xGridPoses = [];
    let yGridPoses = [];
    let finalGridPoses = []
    
    
    for (let i = 0; i < xOffsets.length; i++) {
      offsetVector = createVector(xOffsets[i]*r,
                            yOffsets[i]*r)
      gridPos = this.pointToGridIndexes(p5.Vector.add(pos, offsetVector))
      xGridPoses.push(gridPos.x);
      yGridPoses.push(gridPos.y);
    }
    
    let xMinGridPos = Math.min.apply(null, xGridPoses);
    let xMaxGridPos = Math.max.apply(null, xGridPoses);
    let yMinGridPos = Math.min.apply(null, yGridPoses);
    let yMaxGridPos = Math.max.apply(null, yGridPoses);
    
    for (let x = xMinGridPos; x <= xMaxGridPos; x++) {
      for (let y = yMinGridPos; y <=yMaxGridPos; y++) {
        finalGridPoses.push (createVector(x,y));
      }
    }
    return finalGridPoses;
  }
  
  pointToGridIndexes(pos) {
    let x;
    let y;
    
    x = Math.floor(pos.x / this.spacerX);
    y = Math.floor(pos.y / this.spacerY);
    
    x = Math.min(Math.max(parseInt(x), 0), this.nSubdivisions-1)
    y = Math.min(Math.max(parseInt(y), 0), this.nSubdivisions-1)
    
    return createVector(x, y);
  }  
  
  
  pointOnRect(pos, xLow, xHigh, yLow, yHigh) {
    // jelenleg nem használt
    if (pos.x>xLow && pos.x<xHigh && pos.y>yLow && pos.y<yHigh) {
      return 1
    }
    return 0
  }
}

