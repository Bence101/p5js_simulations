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

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}