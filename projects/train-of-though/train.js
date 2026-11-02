class Train {
  constructor(tile) {
    this.pos = tile.startPoint;
    this.currentTile = tile;
    this.progress = 0;
    this.progressStep = TRAINSPEED;
    this.finished = 0;
    
    this.type = int(random(1, NSTATIONS+1));
  }
  
  update(tiles) {
    if (!this.finished) {
      this.move(tiles)
    }
  }
  
  finishCheck() {
    if (this.currentTile.type == 0) {
      return false
    } 
    if (this.currentTile.type == this.type) {
      playGameSound(hornSound);
      this.finished = 1;
      SCORE += 10;
      nFinishedTrains +=1;
      gameEndTest();
    }
    if (this.currentTile.type != this.type) {
      playGameSound(wrongStationSound);
      this.finished = 1;
      nFinishedTrains +=1;
      gameEndTest();
    }
    this.pos = this.currentTile.midPoint;
  }
  
  
  move(tiles) {
    let nextPos;
    let startPoint;
    let endPoint;
    let segmentLength;
    if (this.progress <= 0.5) {
      let remappedProgress = map(this.progress, 0, 0.5, 0, 1);
      startPoint = this.currentTile.startPoint;
      endPoint = this.currentTile.midPoint;
      nextPos = p5.Vector.add(startPoint, 
                              p5.Vector.sub(endPoint, 
                                            startPoint).mult(remappedProgress));
      this.pos = nextPos;
    }
    if ((this.progress > 0.5) && (this.progress < 1)) {
      let remappedProgress = map(this.progress, 0.5, 1, 0, 1)
      startPoint = this.currentTile.midPoint;
      endPoint = this.currentTile.endPoint;
      
      nextPos = p5.Vector.add(startPoint, 
                              p5.Vector.sub(endPoint, 
                                            startPoint).mult(remappedProgress));
      this.pos = nextPos
    } 
    if (this.progress >= 1) {
      this.progress = 0;
      this.currentTile = this.currentTile.nextTile(tiles);
      this.finishCheck();
    }
    this.progress += this.progressStep;
  }
  
  
  
  display() {
    let trainColors = getColorsByType(this.type)
    push();
      stroke(0);
      strokeWeight(0.5);
      fill(trainColors[0])
      arc(this.pos.x, this.pos.y, 20, 20, PI, 0)
      fill(trainColors[1])
      arc(this.pos.x, this.pos.y, 20, 20, 0, PI)
    pop();
  }
}