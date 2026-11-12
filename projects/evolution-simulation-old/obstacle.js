class Obstacle {
  constructor(posStart, size, settings) {
    this.settings = settings;
    this.posStart = posStart;
    this.width = size[0];
    this.height = size[1];
    this.angle = 1; // még nincs implementálva forgatás
    this.posCenter = createVector(this.posStart.x+this.width/2, 
                                  this.posStart.y+this.height/2);
    this.color = color(50, 200, 200);  
    this.color.setAlpha(128);
        
    this.setCornerPoints();
    this.setSides();
  }
    
  update() {
    // ez elvileg arra lenne jó, hogy a középpontját módosítsa, ha mozgó obstacle lenne
  }
  
  onIt(vector, absResize = 0) {
    if ((abs(this.posCenter.x-vector.x) < abs(this.width/2)) && 
       (abs(this.posCenter.y-vector.y) < abs(this.height/2))) {
      return true;
    } else {
      return false;
    }
    
    
    // if (vector.x>=(this.posStart.x) && 
    //     vector.x<=(this.posStart.x+this.width) &&
    //     vector.y>=(this.posStart.y) && 
    //     vector.y<=(this.posStart.y+this.height)) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
  
  setCornerPoints() {
    this.cornerPoints = [];
    const xShifts = [-1, -1, 1, 1];
    const yShifts = [-1, 1, 1, -1];
    
    for (let i=0; i<xShifts.length; i++) {
      let newPoint = createVector(this.posCenter.x+(this.width/2)*xShifts[i], 
                                  this.posCenter.y+(this.height/2)*yShifts[i]);
      this.cornerPoints.push(newPoint);
    }
  }
  
 setSides() {
    this.sides = [];
    for (let i=0; i<this.cornerPoints.length; i++) {
      const firstCornerPoint = this.cornerPoints[i];
      // print(firstCornerPoint)

      // let secondCornerPoint = undefined;
      let secondCornerPoint;
      if (i == this.cornerPoints.length-1) {
        secondCornerPoint = this.cornerPoints[0].copy();
      } else {
        secondCornerPoint = this.cornerPoints[i+1].copy();
      }
      this.sides.push([firstCornerPoint, secondCornerPoint])
    }
  }
  
  
  returnClosestSidePoint(pos) {
    let sideSegment = this.returnFacedSide(pos, false);
    let projectedPosOnSide = Utils.vectorProjection(pos, sideSegment[0], sideSegment[1]);
    
    return projectedPosOnSide
  }
  
  returnFacedSide(pos, returnCenterIfPosOnIt = true) {    
    // returns the closest side of the rectangle as two corner points
      // for oblong rectangles simple distance sorting does not work properly 
      // so I implemented a slightly more complex logic
    
    // Ismert probléma:
    // egyelőre jó így, viszont, ha egyszerre két oldal is látható (sarok pos)
      // akkor igazából két pontot kellene megadni neki 
      // (mover.pos, mover.futurepos) és ezt az egyenest kell megnéznem, 
      // hogy melyik oldalt vágja át először, 
      // ha furcsa a viselkedés, akkor át kell alakítani
    
    // possible inner triangles in a rectangle
    let shiftAmount = max(this.height, this.width)
    let triangles = [
      [this.cornerPoints[0], this.cornerPoints[1], this.posCenter],
      [this.cornerPoints[1], this.cornerPoints[2], this.posCenter],
      [this.cornerPoints[2], this.cornerPoints[3], this.posCenter],
      [this.cornerPoints[3], this.cornerPoints[0], this.posCenter],
    ]
    
    // return center point if the given pos is on the obstacle
    if (this.onIt(pos) && returnCenterIfPosOnIt) {
      return [this.posCenter, this.posCenter];
    }
    
    
    // check which side is the closest to the given pos
    for (let tri of triangles) {
      let shiftedTriangleVertex0 =  p5.Vector.sub(tri[0],
                                                  tri[2]).setMag(shiftAmount).add(tri[0])
      let shiftedTriangleVertex1 =  p5.Vector.sub(tri[1],
                                                  tri[2]).setMag(shiftAmount).add(tri[1])

      let onTriangle = Utils.PointInTriangle(pos, 
                                       shiftedTriangleVertex0, 
                                       shiftedTriangleVertex1, 
                                       tri[2])
      if (onTriangle) {
        if (this.settings.debug.showObstacleDebugTriangles) {
          triangle(shiftedTriangleVertex0.x, shiftedTriangleVertex0.y,
                   shiftedTriangleVertex1.x, shiftedTriangleVertex1.y,
                   tri[2].x, tri[2].y)
        }

        return [tri[0], tri[1]];
      }
    }
    
    // return center point if not applicable
      // this cannot happen if the function was called properly
      // anyway I handle it this way for now
    return [this.posCenter, this.posCenter];
  }
  
  
  display() {
    push();
      strokeWeight(5);
      stroke(color(255, 0, 0))
      this.setSides()
      strokeWeight(1);

      stroke(0, 100, 220);
      fill(this.color);
      rect(this.posStart.x, this.posStart.y, 
           this.width, this.height);
      circle(this.posStart.x, this.posStart.y, 10)
      fill(color(0,0,0));
      // text('text', this.posCenter.x-5, this.posCenter.y)
    pop();
    // for (let cornerPoint of this.cornerPoints) {
    //   circle(cornerPoint.x, cornerPoint.y, 3)
    // }
  }
}