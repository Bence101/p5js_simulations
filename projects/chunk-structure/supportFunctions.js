// function mousePressed() {
//   let tmpVal = uniformGridSpace.queryRangeCircle(createVector(mouseX, mouseY),
//                                           mouseCell.radius)
//   print(tmpVal)
// }

function keyPressed() {
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement
    && activeElement.matches("input, select, textarea, [contenteditable='true']")) {
    return;
  }

  if (keyCode === 68) {
    mouseCell.radius += 5;
  } else if (keyCode === 65) {
    mouseCell.radius -= 5;
  } else {
    return;
  }

  print(mouseCell.radius)
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



