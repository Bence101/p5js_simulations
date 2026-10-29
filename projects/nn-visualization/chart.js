
class Chart {
  constructor(pos, w, h) {
    this.pos = pos;
    this.width = w;
    this.height = h;
    this.fillColor = color(200,190,180);
  }
  
  update(inputs, targets, bgInputs, bgTargets, scale, gridSizes) {
    this.inputs = inputs
    this.targets = targets
    this.bgInputs = bgInputs
    this.bgTargets = bgTargets
    this.scale = scale // [xMin, xMax, yMin, yMax]
    this.gridSizes = gridSizes
  }
  
  displayTile(x, y, w, h, tileColor) {    
    let transformedPos = this.transformPointToPixelPos(x, y)

    push()
      tileColor.setAlpha(100)
      translate(this.pos.x, this.pos.y)
      fill(tileColor)
      noStroke()
      rect(transformedPos[0], transformedPos[1], w, -h)
    pop()
  }
  
  displayTiles() {
    // the bgInputs order must start from the left bottom corner (-x, -y)
    // let gridSize = Math.sqrt(this.bgInputs.length)
    let w = this.width/(this.gridSizes[0]*2)
    let h = this.height/(this.gridSizes[1]*2)
   
    for (let i=0; i < this.bgInputs.length; i++) {
      let x = this.bgInputs[i][0]
      let y = this.bgInputs[i][1] * -1

      let labelColor = this.getLabelColor(this.bgTargets[i][0])

      
      this.displayTile(x, y, 
                       w, h, labelColor)
    }
  }

  displayPoint(x, y, pointColor) {
    let transformedPos = this.transformPointToPixelPos(x, y)
    
    push()
      translate(this.pos.x, this.pos.y)
      fill(pointColor)
      noStroke()
      circle(transformedPos[0], transformedPos[1], 5)
    pop()
  }
  
  displayPoints() {
    for (let i=0; i < this.inputs.length; i++) {
      let labelColor = this.getLabelColor(this.targets[i][0])
      this.displayPoint(this.inputs[i][0], -this.inputs[i][1], labelColor)
    }
  }
  
  displayAxis() {
    let xArrowStart = this.transformPointToPixelPos(this.scale[0], 0)
    let xArrowEnd = this.transformPointToPixelPos(this.scale[1], 0)
    let yArrowStart = this.transformPointToPixelPos(0, this.scale[2])
    let yArrowEnd = this.transformPointToPixelPos(0, this.scale[3])
    
    push()
      translate(this.pos.x, this.pos.y)
      fill(0)
      stroke(0)
      
      line(xArrowStart[0], xArrowStart[1], xArrowEnd[0], xArrowEnd[1])
      line(yArrowStart[0], yArrowStart[1], yArrowEnd[0], yArrowEnd[1])
    pop()
  }
  
  
  display() {
    push()
      fill(this.fillColor)
      noStroke()
      rect(this.pos.x, this.pos.y, this.width, this.height)
    
      this.displayTiles()
      this.displayPoints()
      this.displayAxis()
    pop()
  }
  
  // support functions
  transformPointToPixelPos(x, y) {
    let xTransformed = map(x, this.scale[0], this.scale[1], 0, this.width)
    let yTransformed = map(y, this.scale[2], this.scale[3], 0, this.height)
    
    return [xTransformed, yTransformed]
  }
  
  getLabelColor(label) {
    let red = map(label, 1, 0, 0, 255)
    let blue = map(label, 0, 1, 0, 255)
    return color(red, 0, blue)
    if (label) {
      return color(0,0,200)
    } 
    return color(200,0,0)
  }
}

