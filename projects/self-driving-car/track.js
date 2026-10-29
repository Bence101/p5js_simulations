class Track {
  constructor(pos, trackPicture, checkpointList) {
    this.pos = pos;
    this.trackImg = trackPicture.get();
    this.wallColor = [0, 90, 102, 255];
    this.trackColor = [0, 0, 0, 0];
    this.checkpoints = [];
    this.createCheckpoints(checkpointList);
  }

  update() {
    print('Not implemented!')
  }

  checkCollision(vector) {
    let point = p5.Vector.sub(vector, this.pos)
    let pickedColor = this.trackImg.get(point.x, point.y)
    if (arrayEquals(pickedColor, this.trackColor)) {
      return 0;
    }
    if (arrayEquals(pickedColor, this.wallColor)) {
      return 1;
    }
  }

  createCheckpoints(checkpointList) {
    let num = 1;
    for (let coordinates of checkpointList) {
      let checkpoint = {'num': num,
                        'start': createVector(coordinates[0], coordinates[1]),
                        'end': createVector(coordinates[2], coordinates[3]),
                        'center': createVector((coordinates[0]+coordinates[2])/2, (coordinates[1]+coordinates[3])/2)
                       }
      this.checkpoints.push(checkpoint);
      num++;
    }
  }
  
  
  display() {
    image(this.trackImg, this.pos.x, this.pos.y);
    
    push();
    stroke(color(255, 255, 0));
    strokeWeight(3)
    for (let checkpoint of this.checkpoints) {
      line(checkpoint.start.x, checkpoint.start.y, 
           checkpoint.end.x, checkpoint.end.y) 
    }
    pop();
  }
}





function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}