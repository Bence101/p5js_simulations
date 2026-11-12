class Eyesight {
  constructor(owner) {
    this.settings = owner.settings;
    this.properties = owner.properties;
    this.owner = owner;

    this.pos = this.owner.transform.pos;
    this.vel = this.owner.mover.vel;
    this.heading = this.owner.mover.vel.heading();

    this.fieldOfView = this.properties.eyesight.fieldOfView;
    this.viewDistance = this.properties.eyesight.viewDistance;
    this.drawFieldOfView = this.properties.eyesight.drawFieldOfView;
    this.drawRays = this.properties.eyesight.drawRays;


    this._createRays();
  }

  update() {
    this.heading = this.owner.mover.vel.heading();
    this.ray = this.vel.copy().setMag(this.viewDistance).add(this.pos);
    this._updateRays();
  }

  _createRays() {
    this.rays = [];
    this.rays.push(new Ray(this.pos, this.vel, this.viewDistance))
  }
  
  _updateRays() {
    for (let ray of this.rays) {
      ray.update(this.pos, this.vel, this.viewDistance);
    }
  }
  
  isSeenByRay(objects, returnAllHits = false, returnOnlyFirstRayHits = true) {
    let hitsOfRays = [];
    for (let ray of this.rays) {
      hitsOfRays.push(ray.getHits(objects, returnAllHits))
    }
    if (returnOnlyFirstRayHits) {
      return hitsOfRays[0];
    }
    return hitsOfRays;
  }

  display() {
    if (this.drawFieldOfView) {
      push();
      strokeWeight(2);
      noFill();
      stroke(color(0, 255, 0));

      // circle(this.pos.x, this.pos.y, this.viewDistance*2)
      arc(
        this.pos.x,
        this.pos.y,
        this.viewDistance * 2,
        this.viewDistance * 2,
        this.heading - this.fieldOfView,
        this.heading + this.fieldOfView,
        PIE
      );
      pop();

      this.rayActive = 0;
    }
    if (this.drawRays) {
      // display rays
      this.rays.forEach((object) => object.display());
    }

  }

  // Jelenleg nem használom, de valószínűleg hasznos lesz
  // isSeen(vector, objectRadius = 0) {
  //   // check if a point is in the objects field of view
  //     // the field of view is not effected by the objectRadius!
  //   if (vector.dist(this.pos)<=(this.viewDistance+objectRadius )) {
  //     let diffVector = p5.Vector.sub(vector, this.pos);
  //     if (abs(diffVector.heading()-this.heading)<this.fieldOfView) {
  //         return 1;
  //         }
  //   }
  //   return 0;
  // }
}


class Ray {
  constructor(startPos, direction, len) {
    this.startPos = startPos;
    this.direction = direction;
    this.len = len;
    this.endPos = this.direction.copy().setMag(this.len).add(this.startPos);
  }
  
  update(startPos, direction, len) {
    this.startPos = startPos || this.startPos;
    this.direction = direction || this.direction;
    this.len = len || this.len;
    this.endPos = this.direction.copy().setMag(this.len).add(this.startPos);
    // this.lastClosestHitPos = undefined;
  }

  getHits(obstacles, all = false) {
    let hits = [];
    for (let obstacle of obstacles) {
      for (let side of obstacle.sides) {
        let iPos = this._segmentIntersection(
          side[0],
          side[1],
          this.startPos,
          this.endPos
        );
        if (iPos) {
          const hit = {
            dist: this.startPos.dist(iPos),
            pos: iPos,
            obstacle: obstacle
          };
          hits.push(hit);
        }
      }
    }
    hits = hits.sort((a, b) =>
      a.dist > b.dist ? 1 : b.dist > a.dist ? -1 : 0
    );
    if (all) {
      return hits;
    }
    const closestHit = hits[0];
    if (closestHit) {
      this.lastClosestHitPos = closestHit.pos;
    } else {
      this.lastClosestHitPos = undefined;
    }
    return closestHit;
  }

  _segmentIntersection(v1, v2, v3, v4) {
    // source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
    // Mi történik, ha a denominator = 0?
    const x1 = v1.x;
    const y1 = v1.y;
    const x2 = v2.x;
    const y2 = v2.y;
    const x3 = v3.x;
    const y3 = v3.y;
    const x4 = v4.x;
    const y4 = v4.y;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;
    // print(v1, v2, v3, v4)
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const ix = x1 + t * (x2 - x1);
      const iy = y1 + t * (y2 - y1);
      const intersectionPoint = createVector(ix, iy);
      return intersectionPoint;
    }
    return undefined;
  }

  display() {
    let rayEnd = this.endPos.copy();
    if (this.lastClosestHitPos) {
      rayEnd = this.lastClosestHitPos
    }
    
    push();
    fill(0)
    stroke(color(100, 100, 100));
    if (this.lastClosestHitPos) {
      circle(this.lastClosestHitPos.x, this.lastClosestHitPos.y, 20)
    }
    line(this.startPos.x, this.startPos.y, rayEnd.x, rayEnd.y);
    pop();
  }
}


