let currentGen = 0;
let runFinished = false;
let initializationError;
let drivingStage;
let generationOutput;
let generationAgeOutput;
let runState;

function setup() {
  if (initializationError) {
    throw initializationError;
  }
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch");
  canvas.elt.setAttribute("role", "img");
  canvas.elt.setAttribute("aria-label", "Red cars on the bundled teal PNG track, with yellow ordered checkpoints.");
  track = new Track(createVector(0, 0), trackPicture, checkpointList);
  START_POINT = createVector(start[0], start[1]);
  generationOutput = document.getElementById("generation");
  generationAgeOutput = document.getElementById("generation-age");
  runState = document.getElementById("run-state");
  installPageInputs();
  ProjectPage.connect({ canvas, defaults, applySettings, restart });
}

function applySettings(settings) {
  validateSettings(settings);
  simSpeed = settings.simSpeed;
  mutationRate = settings.mutationRate;
  showParentText = settings.showParentText;
  // popSize belongs to the active run, not the pending form value.
}

function restart(settings) {
  validateSettings(settings);
  popSize = settings.popSize;
  population = new Population(popSize, 200);
  currentGen = 0;
  runFinished = false;
  runState.textContent = "Learning is running.";
  updateReadouts();
  loop();
}

function draw() {
  background(220);

  for (let i = 0; i < simSpeed && !runFinished; i++) {
    population.update(track);
    if ((!population.hasAlive) || (population.age >= maxSimLength)) {
      population.calculateFitnesses();
      population = new Population(popSize, 200, population);
      currentGen++;
      if (currentGen >= GENERATIONS) {
        runFinished = true;
        runState.textContent = "Generation limit reached. Restart Simulation starts fresh learning with current settings.";
        noLoop();
        break;
      }
    }

    // Retained source-only skip setting; it can monopolize this draw callback.
    if (currentGen < SKIPNGEN) {
      i -= 1;
    }
  }

  track.display();
  population.display();
  updateReadouts();
}

function updateReadouts() {
  generationOutput.textContent = String(currentGen);
  generationAgeOutput.textContent = String(population.age);
}

function validPopulationSize(value) {
  return Number.isInteger(value) && value >= 1 && value <= 100;
}

function validateSettings(settings) {
  if (!validPopulationSize(settings.popSize)) {
    throw new Error("Population size must be a whole number from 1 to 100.");
  }
  if (!Number.isInteger(settings.simSpeed) || settings.simSpeed < 1 || settings.simSpeed > 10) {
    throw new Error("Simulation speed must be a whole number from 1 to 10.");
  }
  if (!Number.isFinite(settings.mutationRate) || settings.mutationRate < 0 || settings.mutationRate > 1) {
    throw new Error("Mutation amplitude must be a number from 0 to 1.");
  }
  if (typeof settings.showParentText !== "boolean") {
    throw new Error("Show ancestor labels must be a boolean.");
  }
}

function installPageInputs() {
  const form = document.getElementById("simulation-controls");
  const sizeInput = document.getElementById("population-size");
  const error = document.getElementById("population-error");
  const restartButton = document.getElementById("restart-simulation");
  const message = "Enter a whole population size from 1 to 100. Correct this field to apply settings or restart.";

  function clearError() {
    sizeInput.setCustomValidity("");
    sizeInput.removeAttribute("aria-invalid");
    error.hidden = true;
    error.textContent = "";
  }

  function checkPopulationInput(event) {
    clearError();
    if (!validPopulationSize(sizeInput.valueAsNumber)) {
      sizeInput.setCustomValidity(message);
      sizeInput.setAttribute("aria-invalid", "true");
      error.textContent = message;
      error.hidden = false;
      // Stop before the shared controller reads an empty/non-finite number.
      event.stopImmediatePropagation();
      event.preventDefault();
      if (event.type === "click") {
        sizeInput.reportValidity();
      }
    }
  }

  form.addEventListener("input", checkPopulationInput, true);
  form.addEventListener("change", checkPopulationInput, true);
  restartButton.addEventListener("click", checkPopulationInput, true);
  form.addEventListener("reset", clearError);

  drivingStage = document.getElementById("sketch");
  drivingStage.addEventListener("pointerdown", () => drivingStage.focus({ preventScroll: true }));
  drivingStage.addEventListener("keydown", (event) => {
    if (drivingFocusActive() && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
      event.preventDefault();
    }
  });
}

function drivingFocusActive() {
  return document.hasFocus() && document.activeElement === drivingStage;
}

function preload() {
  if (window.location.protocol === "file:") {
    initializationError = new Error("This simulation needs HTTP, not a file:// address. Start VS Code Live Server or another local HTTP server, then copy its http:// address into Edge. Controls remain disabled until initialization succeeds.");
    document.getElementById("simulation-status").textContent = initializationError.message;
    return;
  }

  function failedImage(path, error) {
    initializationError = new Error(`Initialization failed: could not load ${path}. Controls remain disabled.`);
    document.getElementById("simulation-status").textContent = initializationError.message;
    console.error(initializationError.message, error);
  }
  carPicture = loadImage("redcar.png", (image) => { carPicture = image; }, (error) => failedImage("redcar.png", error));
  trackPicture = loadImage("track_1.png", (image) => { trackPicture = image; }, (error) => failedImage("track_1.png", error));
}
