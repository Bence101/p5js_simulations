function createMatrix(n, diagonalValue) {
  let matrix = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      if (i === j && diagonalValue !== undefined) {
        row.push(diagonalValue);
      } else {
        row.push(Math.random() * 2 - 1);
      }
    }
    matrix.push(row);
  }
  return matrix;
}


function constrainBorder(vector, mode='teleport') {
  //++ ezt majd úgy kell megcsinálni, hogy ne használja a globális méretet!
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



