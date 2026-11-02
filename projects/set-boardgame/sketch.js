const NUM_CARDS = 12;
const NUM_ATTRIBUTES = 3;
const NUM_VALUES = 3;
const cardSize = 100;
const margin = 40;
let cards = [];

function setup() {
  createCanvas(4 * (cardSize + margin), 3 * (cardSize + margin));
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noLoop();

  for (let i = 0; i < NUM_CARDS; i++) {
    cards.push(new Card());
  }
}

function draw() {
  background(220);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let idx = i * 4 + j;
      cards[idx].display(j * (cardSize + margin) + cardSize / 2 + margin, i * (cardSize + margin) + cardSize / 2 + margin);
    }
  }
}

// class Card {
//   constructor() {
//     this.attributes = [];
//     for (let i = 0; i < NUM_ATTRIBUTES; i++) {
//       this.attributes.push(floor(random(NUM_VALUES)) + 1);
//     }
//   }

//   display(x, y) {
//     strokeWeight(2);
//     rect(x, y, cardSize, cardSize);

//     let colors = ['#FF0000', '#00FF00', '#0000FF'];
//     let fills = ['#FFFFFF00', colors[this.attributes[0] - 1]];
//     let shapes = ['ellipse', 'rect', 'triangle'];

//     for (let i = 0; i < this.attributes[2]; i++) {
//       fill(fills[this.attributes[1] - 1]);
//       stroke(colors[this.attributes[0] - 1]);
//       let offset = (i * cardSize * 0.2) - (this.attributes[2] - 1) * cardSize * 0.1;
//       switch (shapes[this.attributes[2] - 1]) {
//         case 'ellipse':
//           ellipse(x, y + offset, cardSize / 2, cardSize / 2);
//           break;
//         case 'rect':
//           rect(x, y + offset, cardSize / 2, cardSize / 2);
//           break;
//         case 'triangle':
//           triangle(x - cardSize / 4, y + offset + cardSize / 4, x + cardSize / 4, y + offset + cardSize / 4, x, y + offset - cardSize / 4);
//           break;
//       }
//     }
//   }
// }

function mouseClicked() {
  let idxX = floor(mouseX / (cardSize + margin));
  let idxY = floor(mouseY / (cardSize + margin));
  let index = idxY * 4 + idxX;

  if (index >= 0 && index < NUM_CARDS) {
    cards[index].selected = !cards[index].selected;
  }

  let selectedCards = cards.filter(card => card.selected);
  if (selectedCards.length === 3 && isValidSet(selectedCards)) {
    alert("You found a set!");
    selectedCards.forEach(card => card.selected = false);
  }
  redraw();
}

function isValidSet(selectedCards) {
  for (let i = 0; i < NUM_ATTRIBUTES; i++) {
    let uniqueValues = new Set(selectedCards.map(card => card.attributes[i]));
    if (uniqueValues.size !== 1 && uniqueValues.size !== NUM_VALUES) {
      return false;
    }
  }
  return true;
}

class Card {
  constructor() {
    this.attributes = [];
    this.selected = false;
    for (let i = 0; i < NUM_ATTRIBUTES; i++) {
      this.attributes.push(floor(random(NUM_VALUES)) + 1);
    }
  }

  display(x, y) {
    strokeWeight(2);
    if (this.selected) {
      fill(200, 200, 255);
    } else {
      fill(255);
    }
    rect(x, y, cardSize, cardSize);

    let colors = ['#FF0000', '#00FF00', '#0000FF'];
    let fills = ['#FFFFFF00', colors[this.attributes[0] - 1]];
    let shapes = ['ellipse', 'rect', 'triangle'];

    for (let i = 0; i < this.attributes[2]; i++) {
      // fill(fills[this.attributes[1] - 1]);
      stroke(colors[this.attributes[0] - 1]);
      let offset = (i * cardSize * 0.2) - (this.attributes[2] - 1) * cardSize * 0.1;
      switch (shapes[this.attributes[2] - 1]) {
        case 'ellipse':
          ellipse(x, y + offset, cardSize / 2, cardSize / 2);
          break;
        case 'rect':
          rect(x, y + offset, cardSize / 2, cardSize / 2);
          break;
        case 'triangle':
          triangle(x - cardSize / 4, y + offset + cardSize / 4, x + cardSize / 4, y + offset + cardSize / 4, x, y + offset - cardSize / 4);
          break;
      }
    }
  }
}

