class radarCollider {
  constructor(pos, heading, angles, radarLenght) {
    this.pos = pos.copy();
    this.heading = heading;
    this.angles = angles;
    this.radarLenght = radarLenght;

    this._createLineColliders();
  }

  _createLineColliders() {
    this.lineColliders = [];
    for (let angle of this.angles) {
      let newPosEnd = p5.Vector.fromAngle(
        angle + this.heading,
        this.radarLenght
      );
      newPosEnd.add(this.pos);

      this.lineColliders.push(new LineCollider(this.pos, newPosEnd));
    }
  }

  update(pos, heading) {
    this.pos = pos.copy();
    this.heading = heading;
    this._createLineColliders();
  }

  checkForCollision(object) {
    this.detections = [];
    for (let lineCollider of this.lineColliders) {
      let detection = lineCollider.checkForCollision(object);
      if (detection) {
        this.detections.push(detection.copy());
      } else {
        this.detections.push(undefined);
      }
    }
    return this.detections;
  }

  display() {
    // // show total lines
    // for (let lineCollider of this.lineColliders) {
    //   lineCollider.display();
    // }

    if (this.detections) {
      for (let i = 0; i < this.lineColliders.length; i++) {
        let radarEnd = this.lineColliders[i].posEnd;
        if (this.detections[i]) {
          radarEnd = this.detections[i];
        }
        push();
        // // show lines
        // stroke(color(0, 255, 0));
        // strokeWeight(3);
        // line(this.pos.x, this.pos.y, radarEnd.x, radarEnd.y);

        noStroke();
        fill(color(0, 0, 0));
        circle(radarEnd.x, radarEnd.y, 10);
        pop();
      }
    }
  }
}

class PolyCollider {
  constructor(points) {
    this.lineColliders = [];

    for (let i = 0; i < points.length - 1; i++) {
      this.lineColliders.push(new LineCollider(points[i], points[i + 1]));
    }
    this.lineColliders.push(
      new LineCollider(points[points.length - 1], points[0])
    );
  }

  update(points) {
    this.lineColliders = [];

    for (let i = 0; i < points.length - 1; i++) {
      this.lineColliders.push(new LineCollider(points[i], points[i + 1]));
    }
    this.lineColliders.push(
      new LineCollider(points[points.length - 1], points[0])
    );
  }

  checkForCollision(object) {
    let collisions = [];
    for (let lineCollider of this.lineColliders) {
      let collision = lineCollider.checkForCollision(object);
      if (collision) {
        return collision.copy();
      }
    }
    return undefined;
  }

  display() {
    for (let lineCollider of this.lineColliders) {
      lineCollider.display();
    }
  }
}

class LineCollider {
  constructor(posStart, posEnd, maxLenght) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.maxLenght = maxLenght;
  }

  update(posStart, posEnd, maxLength) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.maxLength = maxLength || this.maxLength;
    this.adjustPosEnd();
    this.firstCollision = undefined;
  }

  adjustPosEnd() {
    let angle = Math.atan2(
      this.posEnd.y - this.posStart.y,
      this.posEnd.x - this.posStart.x
    );
    let dist = this.posStart.dist(this.posEnd);
    if (dist > this.maxLength) {
      let newPosEnd = p5.Vector.fromAngle(angle, this.maxLength);
      newPosEnd.add(this.posStart);
      this.posEnd = newPosEnd.copy();
    }
  }

  checkForCollision(object) {
    let angle = Math.atan2(
      this.posEnd.y - this.posStart.y,
      this.posEnd.x - this.posStart.x
    );
    let dist = this.posStart.dist(this.posEnd);

    for (let i = 0; i <= dist; i++) {
      let currentPoint = p5.Vector.fromAngle(angle, i);
      currentPoint.add(this.posStart);
      if (object.checkCollision(currentPoint)) {
        this.firstCollision = currentPoint.copy();
        return currentPoint.copy();
      }
    }
    return undefined;
  }

  display() {
    push();
    stroke(0);
    fill(0);
    circle(this.posStart.x, this.posStart.y, 5);
    pop();
    if (this.firstCollision) {
      let lineColor = color(255, 0, 0);
      push();
      fill(lineColor);
      stroke(lineColor);
      strokeWeight(2);
      line(
        this.posStart.x,
        this.posStart.y,
        this.firstCollision.x,
        this.firstCollision.y
      );
      circle(this.firstCollision.x, this.firstCollision.y, 5);
      pop();
    } else {
      let lineColor = color(0, 255, 0);
      push();
      fill(lineColor);
      stroke(lineColor);
      strokeWeight(2);
      line(this.posStart.x, this.posStart.y, this.posEnd.x, this.posEnd.y);
      pop();
    }
  }
}
