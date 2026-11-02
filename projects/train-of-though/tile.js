class Tile {
  constructor(type, x, y, startSide, endSideA, endSideB, firstTile = 0) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.endSideA = endSideA;
    this.endSideB = endSideB;
    this.firstTile = firstTile;
    
    this.pos = createVector(x*TILESIZE, y*TILESIZE);
    this.midPoint = this.pos.copy().add(createVector(TILESIZE/2, TILESIZE/2));
    this.startPoint = this._calculateSidePoint(startSide);
    this.endPoint = this._calculateSidePoint(endSideA);
    this.currentEndSide = 0;
    
    this.endPointA = this._calculateSidePoint(endSideA);
    if (this.endSideB !== undefined) {
      this.endPointB = this._calculateSidePoint(endSideB);
    }
  }
  
  
  changeEndPoint() {
    if (this.endSideB !== undefined) {
      this.currentEndSide = 1-this.currentEndSide;
      if (this.currentEndSide == 0) {
        this.endPoint = this._calculateSidePoint(this.endSideA);
      } else {
        this.endPoint = this._calculateSidePoint(this.endSideB);
      }
    }
  }
  
  clicked(x, y) {
    if (this.onIt(x, y) && this.endSideB !== undefined) {
      playGameSound(clickSound);
      this.changeEndPoint()
    }
  }
  
  nextTile(tiles) {
    // getting current endSide
    let endSide;
    let nextX;
    let nextY;
    if (this.currentEndSide == 0) {
      endSide = this.endSideA;
    } else {
      endSide = this.endSideB;
    }
    
    // get nextTile location
    if (endSide == 0) {
      nextX = this.x - 1;
      nextY = this.y + 0;
    }
    if (endSide == 1) {
      nextX = this.x + 0;
      nextY = this.y + 1;
    }
    if (endSide == 2) {
      nextX = this.x + 1;
      nextY = this.y + 0;
    }
    if (endSide == 3) {
      nextX = this.x + 0;
      nextY = this.y - 1;
    }
    
    for (let tile of tiles) {
      if (tile.x == nextX && tile.y == nextY) {
        return tile
      }
    }
    return tiles[0]
  }
  
  drawDoubleLine(start, end) {
    // good idea but does not work
      // figyelembe kellene venni a be és a ki csatlakozásokat a csempén
      // nem nehéz, de macerás az összes lehetőséghez tartozó csúsztatást betenni
      // egyelőre nem implementáltam
    let startX = start.x;
    let startY = start.y;
    let endX = end.x;
    let endY = end.y;
    let shiftAmount = 5;
    if (startX == endX) {
      line(startX+shiftAmount, startY, endX+shiftAmount, endY);
      line(startX-shiftAmount, startY, endX-shiftAmount, endY);
    }
    if (startY == endY) {
      line(startX, startY + shiftAmount, endX, endY + shiftAmount);
      line(startX, startY - shiftAmount, endX, endY - shiftAmount);
    }
  }
  
  showStationTile() {
    let stationColors = getColorsByType(this.type)
    push();
      noStroke();
      fill(stationColors[0])
      rect(this.pos.x, this.pos.y, TILESIZE, TILESIZE/2);
      fill(stationColors[1])
      rect(this.pos.x, this.pos.y + TILESIZE/2, TILESIZE, TILESIZE/2);
    pop();
  }
  
  display() {
    let tileColor;
    push();
      noStroke();
    
      if ((this.type!=0)) {
        this.showStationTile()
      }

      if (this.endSideB !== undefined) {
          let baseTrackColor = color(220,220,220, 150);
          push();
          strokeWeight(5);
          stroke(baseTrackColor)
          line(this.midPoint.x, this.midPoint.y, this.endPointA.x, this.endPointA.y);
          line(this.midPoint.x, this.midPoint.y, this.endPointB.x, this.endPointB.y);
          pop();
        
          push();
          // fill(TRACKSWITCHCOLOR);
          noFill();
          strokeWeight(4);
          stroke(TRACKSWITCHCOLOR)
          ellipseMode(CORNER);
          circle(this.pos.x, this.pos.y, TILESIZE);
          pop();
      }
    
      if (this.firstTile) {
        fill(0)
        circle(this.startPoint.x, this.startPoint.y, TILESIZE)
      }
    
      // valid track display
      push();
        strokeWeight(8);
        stroke(TRACKCOLOR);
        line(this.startPoint.x, this.startPoint.y, this.midPoint.x, this.midPoint.y);
        line(this.midPoint.x, this.midPoint.y, this.endPoint.x, this.endPoint.y); 
      pop();
    pop();
  }
  
  
  onIt(x, y) {
    if (x>=(this.pos.x) && 
        x<=(this.pos.x+TILESIZE) &&
        y>=(this.pos.y) && 
        y<=(this.pos.y+TILESIZE)) {
      return true;
    } else {
      return false;
    }
  }
  
  _calculateSidePoint(side) {
    let sidePoint;
    if (side == 0) {
      sidePoint = this.pos.copy().add(createVector(0, TILESIZE/2))
    }
    if (side == 1) {
      sidePoint = this.pos.copy().add(createVector(TILESIZE/2, TILESIZE))
    }
    if (side == 2) {
      sidePoint = this.pos.copy().add(createVector(TILESIZE, TILESIZE/2))
    }
    if (side == 3) {
      sidePoint = this.pos.copy().add(createVector(TILESIZE/2, 0))
    }
    return sidePoint
  }
  
}