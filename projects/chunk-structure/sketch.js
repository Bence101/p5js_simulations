const DEFAULTS = {
  subdivisions: 8,
  cellCount: 200,
  probeCount: 20,
  checkProbeNeighbors: true,
  showGridAndEntities: true
};
const DEFAULT_MOUSE_RADIUS = 15;

let subdivisions = DEFAULTS.subdivisions;
let checkProbeNeighbors = DEFAULTS.checkProbeNeighbors;
let showGridAndEntities = DEFAULTS.showGridAndEntities;
let cells = [];
let movers = [];
let uniformGridSpace;
let mouseCell;
let infoTable;
let nCollCheck = 0;

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch");
  infoTable = new InfoTable(createVector(10, 10), []);
  mouseCell = new Cell(createVector(mouseX, mouseY), color(200, 0, 0));

  window.ProjectPage.connect({
    canvas,
    defaults: DEFAULTS,
    applySettings(settings) {
      checkProbeNeighbors = settings.checkProbeNeighbors;
      showGridAndEntities = settings.showGridAndEntities;
    },
    restart(settings) {
      subdivisions = settings.subdivisions;
      cells = Array.from({ length: settings.cellCount }, () =>
        new Cell(createVector(random(0, width), random(0, height))));
      movers = Array.from({ length: settings.probeCount }, () =>
        new Cell(createVector(random(0, width), random(0, height)),
          color(200, 100, 100, 200)));
      mouseCell.radius = DEFAULT_MOUSE_RADIUS;
      nCollCheck = 0;
    }
  });
}

function draw() {
  background(220);
  uniformGridSpace = new UniformGridSpace(createVector(width, height), subdivisions);
  mouseCell.pos = createVector(mouseX, mouseY);
  mouseCell.update();

  for (const cell of cells) {
    cell.update();
    uniformGridSpace.insert(cell, cell.pos, cell.radius);
  }

  for (const mover of movers) {
    mover.randomMove(5);
    if (checkProbeNeighbors) {
      const cellsToCheck = uniformGridSpace.queryRangeCircle(mover.pos, mover.radius);
      for (const cell of cellsToCheck) {
        cell.tested = 1;
        cell.isSeen(mover.pos, mover.radius);
        nCollCheck += 1;
      }
    }
  }

  const mouseCandidates = uniformGridSpace.queryRangeCircle(mouseCell.pos, mouseCell.radius);
  for (const cell of mouseCandidates) {
    cell.tested = 1;
    cell.isSeen(mouseCell.pos, mouseCell.radius);
    nCollCheck += 1;
  }

  if (showGridAndEntities) {
    uniformGridSpace.display();
    for (const cell of cells) {
      cell.display();
    }
    for (const mover of movers) {
      mover.display();
    }
  }

  mouseCell.display();

  infoTable.update(createVector(10, 10), [
    { name: "Checks (k)", value: Math.round(nCollCheck / 1000) },
    { name: "FPS", value: Math.round(frameRate()) }
  ]);
  infoTable.display();
}
