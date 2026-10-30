class InfoTable {
  constructor(pos, infoList) {
    this.pos = pos;
    this.color = color(0, 0, 0, 50);
    this.infoList = infoList;
    this.textSize = 10;
    this.size = [this.textSize*10, 5+infoList.length*(this.textSize+2)]
    // this.config = config;
  }
  
  update(pos, infoList) {
    this.pos = pos.copy();
    this.size = [this.textSize*10, 5+infoList.length*(this.textSize+2)]
    this.infoList = infoList;
  }
  
    
  display() {
    push();
      translate(this.pos.x, this.pos.y);
      noStroke();
      fill(this.color);
      rect(0, 0, this.size[0], this.size[1]);
      textSize(this.textSize);
      textAlign(LEFT, TOP);
      fill(color(255, 255, 255));
      let yOffset = 0;
      for (let info of this.infoList) {
        text(info.name+':', this.textSize/2, 5+yOffset);
        text(info.value, this.textSize/2*11, 5+yOffset);
        yOffset+=this.textSize+2;
      }
    pop();    
  }
}