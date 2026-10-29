

class ImageCreator {
  constructor(pos, size) {
    this.pos = pos;
    this.size = size;
    this.baseColor = color(0, 90, 102);
    this.brush = new Brush(pos, [60, 60], 'circle')

    this._createEmptyImage();
    this.posCenter = createVector(this.pos.x+size[0]/2, 
                                  this.pos.y+size[1]/2);
  }

  _createEmptyImage() {
    this.img = createImage(this.size[0], this.size[1]);
    this.img.loadPixels();
    for (let i = 0; i < this.img.width; i++) {
      for (let j = 0; j < this.img.height; j++) {
        this.img.set(i, j, this.baseColor);
      }
    }
    this.img.updatePixels();
  }

  changeBrush(size, mode) {
    let nextPos = this.brush.pos.copy();
    let nextSize = this.brush.size;
    if (size) {
      nextSize = [nextSize[0]+size, nextSize[1]+size]
    }
    let nextMode = mode || this.brush.mode;
    this.brush = new Brush(nextPos, nextSize, nextMode)
  }
  
  saveImage() {
    this.img.save('test')
  }
  
  loadImage(img) {
    this.img = img.get();
  }
  
  update(mousePos) {
    this.brush.update(mousePos);
    let pixels = this.brush.getPixels();
    if (mouseIsPressed) {
      let brushColor;

      if (mouseButton === CENTER) {
        brushColor = this.baseColor;
      } else {
        brushColor = color(0, 0, 0, 0);
      }
      
      for (let pixel of pixels) {
        if (this.onIt(pixel)) {
          this.img.set(pixel.x-this.pos.x, 
                       pixel.y-this.pos.y, brushColor)
        }
      }
      this.img.updatePixels();
    }
  }
  
  onIt(vector, absResize = 0) {
    if ((abs(this.posCenter.x-vector.x) <= abs(this.size[0]/2)) && 
       (abs(this.posCenter.y-vector.y) <= abs(this.size[1]/2))) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    image(this.img, this.pos.x, this.pos.y);
    this.brush.display();
  }
}

////////////////////////////////////////////////////////////////////


class Brush {
  constructor(pos, size, mode) {
    this.pos = pos;
    this.size = size
    this.mode = mode
  }
  
  update(pos) {
    this.pos = pos;
  }
  
  getPixels() {
    let startX = this.pos.x-this.size[0]/2;
    let startY = this.pos.y - this.size[1]/2;
    let endX = startX + this.size[0];
    let endY = startY + this.size[1];
    let output = [];
    
    for (let pixelX = startX; pixelX <= endX; pixelX++) {
      for (let pixelY = startY; pixelY <= endY; pixelY++) {
        let pixel = createVector(pixelX, pixelY)
        if (this.mode == 'circle') {
          if (pixel.dist(this.pos) <= (this.size[0])/2) {
            output.push(pixel);
          }
        } else {
          output.push(pixel);
        }

      }
    }
    return output
  }
  
  display() {
    push();
      noStroke();
      fill(color(200, 50, 50));
      if (this.mode == 'circle') { 
        circle(this.pos.x, 
               this.pos.y, 
               this.size[0])

      } else {
        rect(this.pos.x-this.size[0]/2, 
             this.pos.y - this.size[1]/2, 
             this.size[0], this.size[1])
      }
    pop();
  }
}