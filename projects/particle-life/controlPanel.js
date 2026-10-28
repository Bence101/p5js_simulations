let newCellGroupDecider;
let nNewCells;
let brushRadius;
let mouseFunction;
const colorList = ["random", "red", "green", "blue", "yellow", "purple", "orange"];
const matrixGroupNames = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange"];
const matrixLabelColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
const matrixControls = [];

function initControlPanel() {
  connectionStrengthMatrix = createMatrix(nGroups, 1);
  const table = document.getElementById("interaction-matrix");
  const header = table.tHead.insertRow();
  const corner = document.createElement("th");
  corner.scope = "col";
  corner.textContent = "Affected / Neighbor";
  header.appendChild(corner);

  for (let column = 0; column < nGroups; column++) {
    header.appendChild(createGroupHeading(column, "col"));
  }

  for (let row = 0; row < nGroups; row++) {
    const tableRow = table.tBodies[0].insertRow();
    tableRow.appendChild(createGroupHeading(row, "row"));
    matrixControls[row] = [];
    for (let column = 0; column < nGroups; column++) {
      const cell = tableRow.insertCell();
      cell.className = "matrix-entry";
      const input = document.createElement("input");
      input.type = "range";
      input.min = "-1";
      input.max = "1";
      input.step = "any";
      input.id = `interaction-${row}-${column}`;
      input.name = matrixSettingName(row, column);
      input.setAttribute("aria-label", `Affected group ${row + 1} ${matrixGroupNames[row]}, neighbor group ${column + 1} ${matrixGroupNames[column]}`);
      input.setAttribute("aria-describedby", "matrix-keyboard-hint");
      // Capture native slider precision as the default, not the two-decimal display.
      input.value = String(connectionStrengthMatrix[row][column]);
      input.defaultValue = input.value;
      const output = document.createElement("output");
      output.htmlFor.add(input.id);
      cell.append(input, output);
      matrixControls[row][column] = { input, output, cell };
    }
  }

  table.addEventListener("focusin", (event) => {
    if (event.target instanceof HTMLInputElement) {
      event.target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  });

  table.addEventListener("keydown", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    let increment;
    if (["+", "ArrowUp", "ArrowRight"].includes(event.key)) {
      increment = 0.1;
    } else if (["-", "ArrowDown", "ArrowLeft"].includes(event.key)) {
      increment = -0.1;
    } else {
      return;
    }
    event.preventDefault();
    input.value = String(Math.max(-1, Math.min(1, input.valueAsNumber + increment)));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  document.getElementById("regenerate-matrix").addEventListener("click", regenerateMatrix);
  document.getElementById("regenerate-cells").addEventListener("click", () => {
    regenerateCells();
    document.getElementById("simulation-status").textContent = "100 random cells regenerated. All control values retained.";
  });
}

function createGroupHeading(group, scope) {
  const heading = document.createElement("th");
  heading.scope = scope;
  const marker = document.createElement("span");
  marker.className = "matrix-group-marker";
  marker.style.backgroundColor = matrixLabelColors[group];
  marker.setAttribute("aria-hidden", "true");
  heading.append(marker, `${group + 1}: ${matrixGroupNames[group]}`);
  return heading;
}

function matrixSettingName(row, column) {
  return `interaction_${row}_${column}`;
}

function applyControlSettings(settings) {
  newCellGroupDecider = colorList.indexOf(settings.newCellColor);
  nNewCells = settings.newCellCount;
  brushRadius = settings.brushRadius;
  mouseFunction = settings.mouseMode;
  for (let row = 0; row < nGroups; row++) {
    for (let column = 0; column < nGroups; column++) {
      const value = settings[matrixSettingName(row, column)];
      connectionStrengthMatrix[row][column] = value;
      const { input, output, cell } = matrixControls[row][column];
      output.value = value.toFixed(2);
      input.setAttribute("aria-valuetext", value.toFixed(2));
      cell.style.setProperty("--interaction-color", `rgb(${(1 - value) * 127.5}, ${(value + 1) * 127.5}, 0)`);
    }
  }
}

function regenerateMatrix() {
  const matrix = createMatrix(nGroups);
  for (let row = 0; row < nGroups; row++) {
    for (let column = 0; column < nGroups; column++) {
      matrixControls[row][column].input.value = String(matrix[row][column]);
    }
  }
  // Keep the registered controls and their initial defaults; synchronize through the adapter.
  document.getElementById("interaction-matrix").dispatchEvent(new Event("input", { bubbles: true }));
  document.getElementById("simulation-status").textContent = "All 36 interactions randomized. Existing cells and brush settings retained.";
}

function mousePressed(event) {
  if (!cells || event.target !== canvas.elt || !isMouseOnCanvas()) {
    return;
  }
  if (mouseFunction === "create") {
    createCellsInCircle(mouseX, mouseY, brushRadius);
  } else if (mouseFunction === "delete") {
    removeCellsInCircle(mouseX, mouseY, brushRadius);
  }
}

function isMouseOnCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function createCellsInCircle(x, y, r) {
  if (!isMouseOnCanvas()) {
    return;
  }
  for (let i = 0; i < nNewCells; i++) {
    let angle = random(TWO_PI);
    let distFromPos = random(r);
    let pos = createVector(x + distFromPos * cos(angle), y + distFromPos * sin(angle));
    if (newCellGroupDecider === 0) {
      let colorIndex = Math.floor(random(0, nGroups));
      cells.push(new Cell(pos, colorIndex));
    } else {
      cells.push(new Cell(pos, newCellGroupDecider - 1));
    }
  }
}

function removeCellsInCircle(x, y, r) {
  for (let i = cells.length - 1; i >= 0; i--) {
    let d = dist(cells[i].pos.x, cells[i].pos.y, x, y);
    if (d < r) {
      cells.splice(i, 1);
    }
  }
}
