class Utils {
  
  static vectorOnCanvas(pos) {
    // this uses the global p5js width, height variables
    if ((pos.x>=0) && (pos.x<=width) && (pos.y>=0) && (pos.y<=height)) { return 1}
    return 0
  }
  
  static simSpeedControl(settings) {
  // ezt majd érdemes refaktorálni
  if (key === settings.keyLayout.fastForwardNSimStep) {
    settings.fastForward = 1;
    print("Fastforwarded by: ", settings.fastForwardFrameAmount)
  }
  if (key === settings.keyLayout.speedUpSimulation) {
    
    if (settings.simSpeed<=4) {
      settings.simSpeed+=1;
    } else {
      settings.simSpeed+=10;
    }
    print("Current simSpeed: ", settings.simSpeed)
  }
  if (key === settings.keyLayout.speedDownSimulation) {
    settings.simSpeed-=10;
    if (settings.simSpeed<=0) {
    settings.simSpeed=0;
    }
    print("Current simSpeed: ", settings.simSpeed)
  }
  if (keyCode === settings.keyLayout.stopRendering) {
    if (isLooping()) {
      print("Loop stopped!")
      noLoop();   
    } else {
      print("Loop restarted!")
      loop();
    }
  }
  }
  
  static saveBoard(settings) {
  // ezt máshova tenném később
  if (key === settings.keyLayout.saveBoard) {
    simulation.board.saveBoard()
  }
  }
  
  
  static vectorProjection(posToProject, startLine, endLine) {
    // source: https://www.youtube.com/watch?v=DHPfoqiE4yQ&ab_channel=TheCodingTrain
    let v1 = p5.Vector.sub(posToProject, startLine);
    let projectedPoint = p5.Vector.sub(endLine, startLine);
    projectedPoint.normalize();
    let scalarProjection = v1.dot(projectedPoint);

    projectedPoint.mult(scalarProjection);
    projectedPoint.add(startLine)

    return projectedPoint;
  }
  
  
  
  static getFirstNKeysOfNestedList(nestedList, n, ascending = true) {
      // nem használt!

    const sortedList = nestedList.sort(([,a], [,b]) => ascending ? (a-b):(b-a))
    const slicedList = sortedList.slice(0, n);

    return slicedList
  }
  
  static getFirstNKeysOfDict(dict, n, ascending = true) {
    // nem használt!! - sajnos dict JS-ben nem fogad be object key-t
    // returns the first N keys of a dict as an array
    // requires a dict with sortable values
    // source: https://stackoverflow.com/questions/1069666/sorting-object-property-by-values

    const nestedList = Object.entries(dict)
    const sortedList = nestedList.sort(([,a], [,b]) => ascending ? (a-b):(b-a))
    const slicedList = sortedList.slice(0, n);
    const listOfKeysToReturn = Object.keys(Object.fromEntries(slicedList));

    return listOfKeysToReturn
  }
  
//   static vectorProjection(posToProject, startLine, endLine) {
//     // source: https://www.youtube.com/watch?v=DHPfoqiE4yQ&ab_channel=TheCodingTrain
//     let v1 = p5.Vector.sub(posToProject, startLine);
//     let projectedPoint = p5.Vector.sub(endLine, startLine);
    
//     projectedPoint.normalize();
//     projectedPoint.mult(v1.dot(projectedPoint));
//     projectedPoint.add(startLine)

//     return projectedPoint;
//   }
  
  // static vectorProjection(baseVector, inputVector) {
  //   // source: https://www.youtube.com/watch?v=DHPfoqiE4yQ&ab_channel=TheCodingTrain
  //   let inputVectorCopy = inputVector.copy().normalize();
  //   let scalarProjection = baseVector.dot(inputVectorCopy);
  //   inputVectorCopy.mult(scalarProjection);
  //   return inputVectorCopy;
  // }
  
  static calculateTrianglePoints(pos, size, angle, offset) {
    let x2 = pos.x - size * cos(angle + offset)
    let y2 = pos.y - size * sin(angle + offset)
    let x3 = pos.x - size * cos(angle - offset)
    let y3 = pos.y - size * sin(angle - offset)
    return {
      x1: pos.x,
      y1: pos.y,
      x2: x2,
      y2: y2,
      x3: x3,
      y3: y3
    }
  }
  
  static PointInTriangle (point, v1, v2, v3) {
    // source: https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    function area (p1, p2, p3) {
      return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
  
    let d1 = area(point, v1, v2);
    let d2 = area(point, v2, v3);
    let d3 = area(point, v3, v1);

    let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(hasNeg && hasPos);
  }
  
  static constrainBorder(vector, settings, mode='teleport') {
    //++ ezt majd úgy kell megcsinálni, hogy ne használja a globális méretet!
    let width = settings.board.boardWidth;
    let height = settings.board.boardHeight;
    let outputVector = vector.copy();
    if (vector.x > width) {
      switch (mode) {
        case 'limit':
          outputVector.x = width;
          break;
        case 'teleport':
          outputVector.x = 0;
          break;
      }
    }
    if (vector.x < 0) {
      switch (mode) {
        case 'limit':
          outputVector.x = 0;
          break;
        case 'teleport':
          outputVector.x = width;
          break;
      }
    }
    if (vector.y > height) {
      switch (mode) {
        case 'limit':
          outputVector.y = height;
          break;
        case 'teleport':
          outputVector.y = 0;
          break;
      }
    }
    if (vector.y < 0) {
      switch (mode) {
        case 'limit':
          outputVector.y = 0;
          break;
        case 'teleport':
          outputVector.y = height;
          break;
      }
    }
    return outputVector
  }  
}