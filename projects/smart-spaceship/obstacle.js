class Obstacle {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.size = createVector(w, h);
    this.fillColor = color(150, 150, 150);
    this.borderColor = color(50, 50, 50);
  }
    
  update() {
    this.display();
  }
  
  contains(vector) {
    if (vector.x>=(this.pos.x) && vector.x<=(this.pos.x+this.size.x) &&
      vector.y>=(this.pos.y) && vector.y<=(this.pos.y+this.size.y)) {
      return true;
    } else {
      return false;
    }
  }
  
  display() {
    // noStroke();
    fill(this.fillColor);
    stroke(this.borderColor);
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}

class Level {
  constructor(recommendedLifetime) {
    this.recommendedLifetime=recommendedLifetime;
    this.obstacles = [];
  }
  
  addObstacle(x, y, w, h) {
    this.obstacles.push(new Obstacle(x, y, w, h));
  }
  
  removeObstacle(pos) {
    for (let i = this.obstacles.length-1; i>=0; i--) {
      if (this.obstacles[i].contains(pos)) {
        this.obstacles.splice(i, 1)
      }
    }
  }
  
  display() {
    for (let obstacle of this.obstacles) {
      obstacle.display();
    }
  }
  
}
