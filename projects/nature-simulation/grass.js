class Grass {
  constructor(pos) {
    this.entityType = 'grass';
    this.entityId = entityIdGenerator();
    
    this.pos = pos;
    this.size = 5;
    this.color = color(0, 200, 20);
    
    // nutritional value
      // később ez csökkenhet és nőhet is idővel
    this.nutritionalValue=50;
    
    this.eaten=0;
  }
 
  getEaten() {
    this.eaten=1;
  }
  

  display() {
    fill(this.color);
    if (this.eaten) {
      fill(color(80,40,40));
    }
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

}



