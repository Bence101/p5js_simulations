"use strict";

class Road {
  constructor(pos) {
    this.nLanes = Config.road.nLanes;
    this.laneWidth = Config.road.laneWidth;
    this.w = this.nLanes * this.laneWidth;
    this.h = Config.road.length;
    this.pos = pos;
    this.color = [50, 50, 50];
  }

  getYFromDistance(distance) {
    return this.pos.y + this.h - distance - cameraY;
  }

  getXFromLane(lane) {
    return this.pos.x + this.laneWidth * lane + this.laneWidth / 2;
  }

  getLaneFromX(x) {
    const relativeX = x - this.pos.x;
    if (relativeX < 0 || relativeX > this.w) {
      return -1;
    }
    return floor(relativeX / this.laneWidth);
  }

  display() {
    push();
    noStroke();
    fill(this.color);
    rect(this.pos.x, this.pos.y - cameraY, this.w, this.h);
    this.displayLaneStripes();
    pop();
  }

  displayLaneStripes() {
    push();
    stroke(255);
    strokeWeight(1 / zoomScale);
    drawingContext.setLineDash([
      15 / zoomScale,
      10 / zoomScale,
    ]);
    for (let lane = 1; lane < this.nLanes; lane++) {
      const x = this.pos.x + lane * this.laneWidth;
      line(x, this.pos.y - cameraY, x, this.pos.y + this.h - cameraY);
    }
    drawingContext.setLineDash([]);
    pop();
  }
}
