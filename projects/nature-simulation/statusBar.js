// class statusBar {
//   constructor(pos) {
//     this.pos=pos;
//   }
// }


class statusBar {
  constructor(pos, fillPercent) {
    this.entity_type='status_bar';
    // this.entity_id = entityIdGenerator();
    
    this.pos = pos;
    this.size = createVector(40, 8);
    this.mid_pos = createVector(this.pos.x-this.size.x/2, 
                                this.pos.y-this.size.y/2 - this.size.y*1.5)
      
    this.baseColor = color(0, 0, 0);
    this.fillColor = color(0, 200, 50);
    
    this.fillPercent = fillPercent;
  }
  
  update(pos, fillPercent) {
    this.pos = pos;
    this.fillPercent = fillPercent;
    this.mid_pos = createVector(this.pos.x-this.size.x/2, 
                                this.pos.y-this.size.y/2 - this.size.y*1.5)
    this.display()
  }



  display() {
    let borderWidth=1;
    
    fill(this.baseColor);
    rect(this.mid_pos.x, this.mid_pos.y, this.size.x, this.size.y);
    fill(this.fillColor);
    let fillPosX = this.mid_pos.x+borderWidth/2;
    let fillPosY = this.mid_pos.y+borderWidth/2;
    let fillSizeX = constrain((this.size.x-borderWidth)*this.fillPercent, 
                              0, (this.size.x-borderWidth));
    let fillSizeY = this.size.y-borderWidth;
    rect(fillPosX, fillPosY,
         fillSizeX,
         fillSizeY);
    fill(color(255,255,255));
    // ha szükséges, ki lehet íratni a konkrét értéket teszteléshez
    // textSize(20);
    // text(this.fillPercent.toFixed(2), this.pos.x-10, 
    //      this.pos.y-this.size.y/2 - this.size.y*0.6);
  }

}