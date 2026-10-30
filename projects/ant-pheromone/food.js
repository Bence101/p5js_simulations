class Food {
  constructor(pos, quantity, properties) {
    this.pos = pos;
    this.color = properties.color;
    this.quantity = quantity; 
    this.size = min(this.quantity, 50)
  }
  
  reduceQuantity() {
    if (this.quantity>0) {
      this.quantity-=1;
    }
    this.size = min(this.quantity, 50);
  }
  
    
  display() {
    noStroke();
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size);
    // fill(color(255, 0, 0));
    // circle(this.pos.x, this.pos.y, 3);
    fill(color(255, 255, 255));
    if (this.quantity>10) {
      textAlign(CENTER, CENTER);
      text(str(this.quantity), this.pos.x, this.pos.y);
    }

  }
}