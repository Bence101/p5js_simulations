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

function entityIdGenerator() {
  lastEntityId+=1;
  return lastEntityId-1
}

// class statusBar {
//   constructor(pos) {
//     this.pos=pos;
//   }
// }

// class TestClass {
//   constructor(pos) {
//     this.entity_type = 'agent';
//   }
// }