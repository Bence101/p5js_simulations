class Obstacle {
  constructor(posStart, width, height, properties, id) {
    this.posStart = posStart;
    this.width = width;
    this.height = height;
    this.posCenter = createVector(this.posStart.x+this.width/2, 
                                  this.posStart.y+this.height/2);
    this.color = color(properties.color);   
    this.color.setAlpha(128);
    this.id = id;
    this.setPointsToAvoid();
  }
    
  update() {
    // ez elvileg arra lenne jó, hogy a középpontját módosítsa, ha mozgó obstacle lenne
    // this.posCenter = createVector(this.posStart.x+this.width/2, 
    //                               this.posStart.y-this.height/2);
    this.display();
  }
  
  setPointsToAvoid() {
    this.pointsToAvoid = [];
    let posCenter = createVector(this.posStart.x+this.width/2, 
                                  this.posStart.y+this.height/2);
    for (let i=-1; i<2; i++) {
      for (let j=-1; j<2; j++) {
        if ((i+j!=i && i+j!=j) || i+j==0) {
          let newPoint = createVector(posCenter.x+this.width/2*i, 
                                      posCenter.y+this.height/2*j);
          this.pointsToAvoid.push(newPoint);
        }
      }
    }
  }
  
  getBorderPoints(pos) {
    let posCenter = createVector(this.posStart.x+this.width/2, 
                                  this.posStart.y+this.height/2);
    let borderPoints = [];
    borderPoints.push(createVector(pos.x, this.posStart.y+this.height));
    borderPoints.push(createVector(pos.x, this.posStart.y));
    borderPoints.push(createVector(this.posStart.x, pos.y));
    borderPoints.push(createVector(this.posStart.x+this.width, pos.y));
    
    fill(color(0,0,0));
    // circle(borderPoint.x, borderPoint.y, 10)
    for (let borderPoint of borderPoints) {
      // circle(borderPoint.x, borderPoint.y, 3)
    }
    return borderPoints;
    // circle(pos.x, pos.y, 5)
    
  }
  
  closestPointToAvoid(pos) {
    let borderPoints = this.getBorderPoints(pos);
    let closestPointToAvoid;
    let dist = 0;
    let minDist = width*height;
    for (let pointToAvoid of borderPoints) {
      dist = pos.dist(pointToAvoid)
      if (dist<minDist) {
        minDist = dist
        closestPointToAvoid = pointToAvoid;
      }
    }
    // noStroke();
    // fill(color(255,0,0));
    // circle(closestPointToAvoid.x, closestPointToAvoid.y, 5)

    return closestPointToAvoid;
  }
  
  getAvoidanceDirection(pos, limit) {
    // currently only works for non diagonal rect obstacles!
    let inLimit = this.contains(pos, limit);
    let xDirection = 0;
    let yDirection = 0;
    
    if (inLimit) {
      let posCenter = createVector(this.posStart.x+this.width/2, 
                                    this.posStart.y+this.height/2);

      let inLeftLimit = pos.x<(posCenter.x-this.width/2) &&
                        pos.x>(posCenter.x-this.width/2-limit);
      let inRightLimit = pos.x>(posCenter.x+this.width/2) &&
                        pos.x<(posCenter.x+this.width/2+limit);
      let inUpLimit = pos.y<(posCenter.y-this.height/2) &&
                        pos.y>(posCenter.y-this.height/2-limit);
      let inDownLimit = pos.y>(posCenter.y+this.height/2) &&
                        pos.y<(posCenter.y+this.height/2+limit);


      if (inLeftLimit) {
        xDirection = (posCenter.x-this.width/2-pos.x)/limit-1
        // xDirection = -1;
      }
      if (inRightLimit) {
        xDirection = 1+(posCenter.x+this.width/2-pos.x)/limit
        // xDirection = 1;
      }
      if (inUpLimit) {
        yDirection = (posCenter.y-this.height/2-pos.y)/limit-1
        // yDirection = -1;
      }
      if (inDownLimit) {
        yDirection = 1+(posCenter.y+this.height/2-pos.y)/limit
        // yDirection = 1;
      }
      
      // show pos if any rule applies
      // if (inLeftLimit || inRightLimit || inUpLimit || inDownLimit) {
      //   fill(0)
      //   circle(pos.x, pos.y, 10)
      // }
    }
    return createVector(xDirection, yDirection);
  }
  
  
  // closestPointToAvoid(pos) {
  //   // corner point version //not working
  //   let closestPointToAvoid;
  //   let dist = 0;
  //   let minDist = width*height;
  //   for (let pointToAvoid of this.pointsToAvoid) {
  //     dist = pos.dist(pointToAvoid)
  //     if (dist<minDist) {
  //       minDist = dist
  //       closestPointToAvoid = pointToAvoid;
  //     }
  //   }
  //   return closestPointToAvoid;
  // }
  
  contains(vector, absResize) {
    if (vector.x>=(this.posStart.x-absResize) && 
        vector.x<=(this.posStart.x+this.width+absResize) &&
        vector.y>=(this.posStart.y-absResize) && 
        vector.y<=(this.posStart.y+this.height)+absResize) {
      return true;
    } else {
      return false;
    }
  }
  
  display() {
    stroke(0, 100, 220);
    fill(this.color);
    rect(this.posStart.x, this.posStart.y, 
         this.width, this.height);
    fill(color(0,0,0));
    text(this.id, this.posCenter.x, this.posCenter.y)
    // for (let pointToAvoid of this.pointsToAvoid) {
    //   circle(pointToAvoid.x, pointToAvoid.y, 3)
    // }
  }
}