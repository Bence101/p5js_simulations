class Cell {
  constructor(pos, inputColor) {
    this.pos = pos;
    this.radius = 10;
    this.seen = 0;
    this.viewRadius = 10;
    this.tested = 0;
    this.color = inputColor || color(0, 0, 0, 100);
    this.originalColor = inputColor;
  }
  
  update() {
    this.seen = 0;
    this.viewRadius = 10;
    this.tested = 0;
    this.color = this.originalColor || color(0, 0, 0, 100);
  }
  
  
  randomMove(vel) {
    this.pos.add(createVector(random(-vel, vel), random(-vel, vel)))
    this.pos = constrainBorder(this.pos, 'teleport');
  }
  
  
  isSeen(vector, objectRadius = 0) {
    // check if a point is in the objects field of view
      // the field of view is not effected by the objectRadius!
    if (vector.dist(this.pos)<=(this.viewRadius+objectRadius )) {
      this.seen = 1;
      return 1;
    }
    return 0;
  }
 
  display() {
    noStroke();
    
    if (this.tested) {
      this.color = color(255, 255, 0, 100);
    }
    
    if (this.seen) {
      this.color = color(0, 255, 0, 100);
    }
    
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.radius*2);
    
    
    // noFill();
    // stroke(0);
    // circle(this.pos.x, this.pos.y, this.viewRadius*2);
  }
}