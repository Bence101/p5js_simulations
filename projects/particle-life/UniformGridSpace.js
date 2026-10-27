class UniformGridSpace {
  constructor(size, nSubdivisions) {
    this.size = size;
    this.spacerX = size.x / nSubdivisions;
    this.spacerY = size.y / nSubdivisions;
    this.nSubdivisions = nSubdivisions;
    this.createEmptyGrid();
  }

  createEmptyGrid() {
    this.grid = [];

    for (let x = 0; x < this.nSubdivisions; x++) {
      this.grid[x] = []; // create nested array
      for (let y = 0; y < this.nSubdivisions; y++) {
        this.grid[x][y] = [];
      }
    }
  }

  insert(object, pos, w, h, tag) {
    // object, pos, w (r), h, tag
    // this.processPoint(object, pos);
    this.processCircle(object, pos, w);
  }

  queryRangeCircle(queryPos, queryRadius) {
    let gridPoses;
    let objArray = [];
    let tmpNewObjArray = [];
    gridPoses = this.circleToGridIndexes(queryPos, queryRadius);
    let alreadyIn = 0;

    for (let gridPos of gridPoses) {
      tmpNewObjArray = this.grid[gridPos.x][gridPos.y];

      for (let newObj of tmpNewObjArray) {
        alreadyIn = 0;
        for (let oldObj of objArray) {
          if (newObj == oldObj) {
            alreadyIn = 1;
          }
        }
        if (alreadyIn == 0) {
          objArray.push(newObj);
        }
      }
    }
    return objArray;
  }

  processCircle(object, pos, r) {
    let gridPoses;
    gridPoses = this.circleToGridIndexes(pos, r);

    for (let gridPos of gridPoses) {
      this.grid[gridPos.x][gridPos.y].push(object);
    }
  }

  processPoint(object, pos) {
    let gridPos = this.pointToGridIndexes(pos);
    this.grid[gridPos.x][gridPos.y].push(object);
  }

  // display functions
  showGrid() {
    stroke(color(0, 0, 150, 150));
    strokeWeight(1);
    for (let x = 1; x < this.nSubdivisions; x += 1) {
      line(x * this.spacerX, 0, x * this.spacerX, this.size.y);
    }
    for (let y = 1; y < this.nSubdivisions; y += 1) {
      line(0, y * this.spacerY, this.size.x, y * this.spacerY);
    }
  }

  showNonEmptyCells() {
    for (let x = 0; x < this.nSubdivisions; x++) {
      for (let y = 0; y < this.nSubdivisions; y++) {
        if (this.grid[x][y].length) {
          let xLow = x * this.spacerX;
          let xHigh = (x + 1) * this.spacerX;
          let yLow = y * this.spacerY;
          let yHigh = (y + 1) * this.spacerY;
          noStroke();
          fill(color(0, 0, 150, 150));
          rectMode(CORNER);
          rect(xLow, yLow, this.spacerX, this.spacerY);
        }
      }
    }
  }

  display() {
    this.showGrid();
    this.showNonEmptyCells();
  }

  // techical support functions
  circleToGridIndexes(pos, r) {
    let gridPos;
    let offsetVector;
    let xOffsets = [0, 1, 0, -1, 0];
    let yOffsets = [0, 0, 1, 0, -1];
    let xGridPoses = [];
    let yGridPoses = [];
    let finalGridPoses = [];

    for (let i = 0; i < xOffsets.length; i++) {
      offsetVector = createVector(xOffsets[i] * r, yOffsets[i] * r);
      gridPos = this.pointToGridIndexes(p5.Vector.add(pos, offsetVector));
      xGridPoses.push(gridPos.x);
      yGridPoses.push(gridPos.y);
    }

    let xMinGridPos = Math.min.apply(null, xGridPoses);
    let xMaxGridPos = Math.max.apply(null, xGridPoses);
    let yMinGridPos = Math.min.apply(null, yGridPoses);
    let yMaxGridPos = Math.max.apply(null, yGridPoses);

    for (let x = xMinGridPos; x <= xMaxGridPos; x++) {
      for (let y = yMinGridPos; y <= yMaxGridPos; y++) {
        finalGridPoses.push(createVector(x, y));
      }
    }
    return finalGridPoses;
  }

  pointToGridIndexes(pos) {
    let x;
    let y;

    x = Math.floor(pos.x / this.spacerX);
    y = Math.floor(pos.y / this.spacerY);

    x = Math.min(Math.max(parseInt(x), 0), this.nSubdivisions - 1);
    y = Math.min(Math.max(parseInt(y), 0), this.nSubdivisions - 1);

    return createVector(x, y);
  }

  pointOnRect(pos, xLow, xHigh, yLow, yHigh) {
    // jelenleg nem használt
    if (pos.x > xLow && pos.x < xHigh && pos.y > yLow && pos.y < yHigh) {
      return 1;
    }
    return 0;
  }
}

class RTree {
  constructor(minChildren, maxChildren) {
    this.minChildren = minChildren;
    this.maxChildren = maxChildren;
    this.children = [];
    this.bounds = null;
    this.leaf = true;
  }

  insert(bounds, obj) {
    if (this.leaf) {
      this.children.push({ bounds, obj });

      if (this.children.length > this.maxChildren) {
        this.subdivide();
      }
    } else {
      const index = this._getIndexForBounds(bounds);
      // print(index, this.children)
      this.children[index].insert(bounds, obj);
    }
    this._updateBounds();
  }

  queryRangeCircle(queryPos, queryRadius) {
    let queryPosList = [queryPos.x, queryPos.y]
    const objArray = [];
    this._queryRangeCircle(queryPosList, queryRadius, objArray);
    return objArray;
  }

  _queryRangeCircle(queryPos, queryRadius, objArray) {
    if (this.leaf) {
      for (const child of this.children) {
        if (this._euclideanDistance(queryPos, child.bounds) <= queryRadius) {
          objArray.push(child.obj);
        }
      }
    } else {
      for (const child of this.children) {
        if (this._euclideanDistance(queryPos, child.bounds) <= queryRadius) {
          child._queryRangeCircle(queryPos, queryRadius, objArray);
        }
      }
    }
  }

  _euclideanDistance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
  }

  _getIndexForBounds(bounds) {
    let index = 0;
    let minArea = Infinity;

    for (let i = 0; i < this.children.length; i++) {
      const area = this._getBoundsArea(
        this._combineBounds(bounds, this.children[i].bounds)
      );

      if (area < minArea) {
        minArea = area;
        index = i;
      }
    }

    return index;
  }

  _updateBounds() {
    this.bounds = this.children.reduce(
      (bounds, child) => this._combineBounds(bounds, child.bounds),
      this.children[0].bounds
    );
  }

  _combineBounds(b1, b2) {
    return [
      Math.min(b1[0], b2[0]),
      Math.min(b1[1], b2[1]),
      Math.max(b1[0] + b1[2], b2[0] + b2[2]),
      Math.max(b1[1] + b1[3], b2[1] + b2[3]),
    ];
  }

  _getBoundsArea(bounds) {
    return (bounds[2] - bounds[0]) * (bounds[3] - bounds[1]);
  }

  // subdivide() {
  //   const children = this.children;
  //   this.children = [];
  //   this.leaf = false;
  //   for (const child of children) {
  //     this.insert(child.bounds, child.obj);
  //   }
  // }
  
  subdivide() {
      const children = this.children;
      this.children = [];
      this.leaf = false;
      for (const child of children) {
        const newChild = new RTree(this.minChildren, this.maxChildren);
        newChild.insert(child.bounds, child.obj);
        this.children.push(newChild);
      }
    }
  
}













// // ez nem igazán erre való és nem is teszteltem
// class KDTree {
//   constructor(points, depth = 0) {
//     this.depth = depth;
//     this.axis = depth % 2;
//     this.left = null;
//     this.right = null;
//     this.points = points;

//     if (points.length > 0) {
//       this.split();
//     }
//   }

//   split() {
//     if (this.points.length <= 1) {
//       return;
//     }

//     this.points.sort((a, b) => a[this.axis] - b[this.axis]);
//     const medianIndex = Math.floor(this.points.length / 2);
//     const median = this.points[medianIndex];

//     const leftPoints = this.points.slice(0, medianIndex);
//     const rightPoints = this.points.slice(medianIndex + 1);

//     this.left = new KDTree(leftPoints, this.depth + 1);
//     this.right = new KDTree(rightPoints, this.depth + 1);
//   }

//   insert(point) {
//     if (this.points.length === 0) {
//       this.points.push(point);
//       this.split();
//     } else if (point[this.axis] < this.points[0][this.axis]) {
//       this.left.insert(point);
//     } else {
//       this.right.insert(point);
//     }
//   }

//   queryRangeCircle(queryPos, queryRadius) {
//     const objArray = [];
//     this._queryRangeCircle(queryPos, queryRadius, objArray);
//     return objArray;
//   }

//   _queryRangeCircle(queryPos, queryRadius, objArray) {
//     if (this.points.length === 0) {
//       return;
//     }

//     for (const point of this.points) {
//       if (this._euclideanDistance(queryPos, point) <= queryRadius) {
//         objArray.push(point);
//       }
//     }

//     const leftSearch = queryPos[this.axis] - queryRadius < this.points[0][this.axis];
//     const rightSearch = queryPos[this.axis] + queryRadius >= this.points[0][this.axis];

//     if (leftSearch) {
//       this.left._queryRangeCircle(queryPos, queryRadius, objArray);
//     }
//     if (rightSearch) {
//       this.right._queryRangeCircle(queryPos, queryRadius, objArray);
//     }
//   }

//   _euclideanDistance(p1, p2) {
//     return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
//   }
// }
