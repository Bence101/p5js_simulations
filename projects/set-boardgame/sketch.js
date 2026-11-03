const NUM_CARDS = 12;
const NUM_ATTRIBUTES = 3;
const NUM_VALUES = 3;
const cardSize = 100;
const margin = 40;
let cards = [];
let solutionIndices = [];
let gameStatus;

function setup() {
  const canvas = createCanvas(4 * (cardSize + margin), 3 * (cardSize + margin));
  canvas.parent("sketch");
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noLoop();

  gameStatus = document.getElementById("game-status");
  const findSetButton = document.getElementById("find-set");
  if (!(gameStatus instanceof HTMLParagraphElement) || !(findSetButton instanceof HTMLButtonElement)) {
    throw new Error("The Set Boardgame page is missing its game status or solver button.");
  }
  findSetButton.addEventListener("click", showSet);

  ProjectPage.connect({
    canvas,
    applySettings(settings) {
      if (Object.keys(settings).length > 0) {
        throw new Error("Set Boardgame has no adjustable settings.");
      }
    },
    restart() {
      startNewBoard();
    },
  });
}

function startNewBoard() {
  cards = Array.from({ length: NUM_CARDS }, () => new Card());
  solutionIndices = [];
  gameStatus.textContent = "New board ready. Select three cards to look for a Set.";
  redraw();
}

function draw() {
  background(220);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let idx = i * 4 + j;
      cards[idx].display(
        j * (cardSize + margin) + cardSize / 2 + margin,
        i * (cardSize + margin) + cardSize / 2 + margin,
        solutionIndices.includes(idx),
      );
    }
  }
}

function mouseClicked() {
  const column = floor((mouseX - margin) / (cardSize + margin));
  const row = floor((mouseY - margin) / (cardSize + margin));
  if (column < 0 || column >= 4 || row < 0 || row >= 3) {
    return;
  }

  const cardX = margin + column * (cardSize + margin);
  const cardY = margin + row * (cardSize + margin);
  if (mouseX >= cardX + cardSize || mouseY >= cardY + cardSize) {
    return;
  }

  const index = row * 4 + column;
  const card = cards[index];
  const selectedCards = cards.filter((selectedCard) => selectedCard.selected);
  if (!card.selected && selectedCards.length >= 3) {
    gameStatus.textContent = "Only three cards can be selected at once. Deselect one before choosing another.";
    return;
  }

  card.selected = !card.selected;
  const updatedSelection = cards.filter((selectedCard) => selectedCard.selected);
  if (updatedSelection.length === 3 && isValidSet(updatedSelection)) {
    gameStatus.textContent = "Set found! The three cards have been deselected.";
    updatedSelection.forEach((selectedCard) => {
      selectedCard.selected = false;
    });
    solutionIndices = [];
  } else if (updatedSelection.length === 3) {
    gameStatus.textContent = "Those three cards do not form a Set. Click one selected card to deselect it and try again.";
  } else {
    gameStatus.textContent = `${updatedSelection.length} of 3 cards selected.`;
  }
  redraw();
}

function isValidSet(selectedCards) {
  if (selectedCards.length !== NUM_ATTRIBUTES) {
    return false;
  }

  for (let i = 0; i < NUM_ATTRIBUTES; i++) {
    let uniqueValues = new Set(selectedCards.map((card) => card.attributes[i]));
    if (uniqueValues.size !== 1 && uniqueValues.size !== NUM_VALUES) {
      return false;
    }
  }
  return true;
}

function findSet() {
  for (let first = 0; first < cards.length - 2; first++) {
    for (let second = first + 1; second < cards.length - 1; second++) {
      for (let third = second + 1; third < cards.length; third++) {
        if (isValidSet([cards[first], cards[second], cards[third]])) {
          return [first, second, third];
        }
      }
    }
  }
  return null;
}

function showSet() {
  const solution = findSet();
  if (!solution) {
    solutionIndices = [];
    gameStatus.textContent = "The solver found no set on this board. Restart the game to deal new cards.";
  } else {
    solutionIndices = solution;
    gameStatus.textContent = "The solver outlined one valid set in green. Select those three cards to submit it.";
  }
  redraw();
}

class Card {
  constructor() {
    this.attributes = [];
    this.selected = false;
    for (let i = 0; i < NUM_ATTRIBUTES; i++) {
      this.attributes.push(floor(random(NUM_VALUES)) + 1);
    }
  }

  display(x, y, isSolution) {
    stroke(isSolution ? "#17834a" : "#384047");
    strokeWeight(isSolution ? 4 : 2);
    fill(this.selected ? "#c8d6ff" : "#ffffff");
    rect(x, y, cardSize, cardSize);

    const colors = ["#FF0000", "#00FF00", "#0000FF"];
    const shapes = ["ellipse", "rect", "triangle"];
    const symbolColor = color(colors[this.attributes[0] - 1]);

    for (let i = 0; i < this.attributes[2]; i++) {
      stroke(symbolColor);
      strokeWeight(3);
      if (this.attributes[1] === 1) {
        noFill();
      } else if (this.attributes[1] === 2) {
        fill(symbolColor);
      } else {
        fill(lerpColor(symbolColor, color("#ffffff"), 0.6));
      }

      const offset = (i * cardSize * 0.2) - (this.attributes[2] - 1) * cardSize * 0.1;
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
