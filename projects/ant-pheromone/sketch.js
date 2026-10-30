"use strict";

let antImg;
let SETTINGS = {};
let BASELINE_SETTINGS;
let activeSettings;
let simulation;
let skippedFrame = 0;
let canvasRenderer;
let initializationFailed = false;

function copyConfiguration(configuration) {
  return JSON.parse(JSON.stringify(configuration));
}

function reportInitializationFailure(error) {
  initializationFailed = true;
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`[Ant Pheromone] Initialization failed: ${reason}`, error);

  const status = document.getElementById("simulation-status");
  if (status) {
    status.setAttribute("role", "alert");
    const punctuation = /[.!?]$/.test(reason) ? "" : ".";
    status.textContent = `Initialization failed: ${reason}${punctuation} Simulation controls remain disabled.`;
  } else {
    const fallback = document.querySelector("[data-project-fallback]");
    if (fallback) {
      fallback.setAttribute("role", "alert");
      fallback.prepend(document.createTextNode(`Initialization failed: ${reason}. `));
    }
  }

  const fields = document.getElementById("simulation-fields");
  const reset = document.getElementById("reset-everything");
  const restart = document.getElementById("restart-simulation");
  if (fields) {
    fields.disabled = true;
  }
  if (reset) {
    reset.disabled = true;
  }
  if (restart) {
    restart.disabled = true;
  }
}

function validateSpeedInput(input, errorMessage) {
  const value = input.value.trim();
  const number = input.valueAsNumber;
  const valid = value !== "" && Number.isFinite(number) && Number.isInteger(number) && number >= 0;
  const message = valid ? "" : "Enter a whole-number simulation speed of 0 or greater.";

  input.setCustomValidity(message);
  if (valid) {
    input.removeAttribute("aria-invalid");
    errorMessage.hidden = true;
    errorMessage.textContent = "";
  } else {
    input.setAttribute("aria-invalid", "true");
    errorMessage.hidden = false;
    errorMessage.textContent = message;
  }
  return valid;
}

function installSpeedValidation() {
  const form = document.getElementById("simulation-controls");
  const speedInput = document.getElementById("simulation-speed");
  const errorMessage = document.getElementById("simulation-speed-error");
  const restart = document.getElementById("restart-simulation");
  if (!(form instanceof HTMLFormElement) || !(speedInput instanceof HTMLInputElement)
    || !errorMessage || !(restart instanceof HTMLButtonElement)) {
    return;
  }

  function rejectInvalidSpeed(event) {
    if (event.target === speedInput && !validateSpeedInput(speedInput, errorMessage)) {
      event.stopImmediatePropagation();
    }
  }

  form.addEventListener("input", rejectInvalidSpeed, true);
  form.addEventListener("change", rejectInvalidSpeed, true);
  restart.addEventListener("click", (event) => {
    if (!validateSpeedInput(speedInput, errorMessage)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  form.addEventListener("reset", () => {
    setTimeout(() => validateSpeedInput(speedInput, errorMessage), 0);
  }, true);
}

function validateAdapterSettings(settings) {
  if (settings === null || typeof settings !== "object"
    || !Number.isInteger(settings.simSpeed) || settings.simSpeed < 0
    || typeof settings.showPheromones !== "boolean") {
    throw new Error("Simulation speed must be a non-negative integer and pheromone visibility must be a boolean.");
  }
  return {
    simSpeed: settings.simSpeed,
    showPheromones: settings.showPheromones
  };
}

function applySettings(settings) {
  const validatedSettings = validateAdapterSettings(settings);
  activeSettings = validatedSettings;
  SETTINGS.simSpeed = validatedSettings.simSpeed;
  SETTINGS.showPheromones = validatedSettings.showPheromones ? 1 : 0;
}

function restartSimulation(settings) {
  if (!BASELINE_SETTINGS) {
    throw new Error("The simulation configuration is not ready.");
  }

  const validatedSettings = validateAdapterSettings(settings);
  const freshSettings = copyConfiguration(BASELINE_SETTINGS);
  freshSettings.simSpeed = validatedSettings.simSpeed;
  freshSettings.showPheromones = validatedSettings.showPheromones ? 1 : 0;
  const freshSimulation = new Simulation(freshSettings);
  freshSimulation.updateInfoTable();
  for (const hill of freshSimulation.map.antHills) {
    for (const ant of hill.ants) {
      ant.updateInfoTable();
    }
  }

  SETTINGS = freshSettings;
  activeSettings = validatedSettings;
  simulation = freshSimulation;
  skippedFrame = 0;
}

function preload() {
  try {
    loadJSON("simSettings.json", (configuration) => {
      try {
        if (configuration === null || typeof configuration !== "object" || Array.isArray(configuration)) {
          throw new Error("simSettings.json must contain a JSON object.");
        }
        const baseline = copyConfiguration(configuration);
        if (!Number.isFinite(baseline.mapWidth) || baseline.mapWidth <= 0
          || !Number.isFinite(baseline.mapHeight) || baseline.mapHeight <= 0
          || !Number.isInteger(baseline.simSpeed) || baseline.simSpeed < 0
          || !Number.isInteger(baseline.skipFirstNFrame) || baseline.skipFirstNFrame < 0) {
          throw new Error("simSettings.json contains invalid canvas or timing defaults.");
        }
        BASELINE_SETTINGS = baseline;
      } catch (error) {
        reportInitializationFailure(error);
      }
    }, (error) => {
      reportInitializationFailure(new Error(`Could not load simSettings.json: ${String(error)}`));
    });

    loadImage("ant.png", (image) => {
      if (!image || image.width <= 0 || image.height <= 0) {
        reportInitializationFailure(new Error("ant.png did not load as a usable image."));
        return;
      }
      antImg = image;
    }, (error) => {
      reportInitializationFailure(new Error(`Could not load ant.png: ${String(error)}`));
    });
  } catch (error) {
    reportInitializationFailure(error);
  }
}

function setup() {
  if (initializationFailed) {
    return;
  }

  try {
    if (!BASELINE_SETTINGS) {
      throw new Error("The simulation configuration did not finish loading.");
    }
    if (!antImg || antImg.width <= 0 || antImg.height <= 0) {
      throw new Error("The ant sprite did not finish loading.");
    }
    if (typeof window.ProjectPage?.connect !== "function") {
      throw new Error("The shared project-page controller did not load.");
    }

    SETTINGS = copyConfiguration(BASELINE_SETTINGS);
    canvasRenderer = createCanvas(SETTINGS.mapWidth, SETTINGS.mapHeight);
    const stage = document.getElementById("sketch");
    if (!stage) {
      throw new Error("The simulation canvas host is missing.");
    }
    canvasRenderer.parent(stage);
    stage.addEventListener("pointerdown", (event) => {
      if (event.target === canvasRenderer.elt && event.isPrimary && event.button === 0) {
        stage.focus({ preventScroll: true });
      }
    });

    const defaults = {
      simSpeed: BASELINE_SETTINGS.simSpeed,
      showPheromones: Boolean(BASELINE_SETTINGS.showPheromones)
    };
    window.ProjectPage.connect({
      canvas: canvasRenderer,
      defaults,
      applySettings,
      restart: restartSimulation
    });
  } catch (error) {
    reportInitializationFailure(error);
  }
}

function mouseClicked(event) {
  if (!simulation || !canvasRenderer || !event || event.target !== canvasRenderer.elt) {
    return;
  }
  if (mouseX < 0 || mouseX > SETTINGS.mapWidth || mouseY < 0 || mouseY > SETTINGS.mapHeight) {
    return;
  }
  simulation.map.createFood(createVector(mouseX, mouseY), 30, SETTINGS.foods);
}

function keyPressed(event) {
  const stage = document.getElementById("sketch");
  if (!simulation || !stage || (document.activeElement !== stage && document.activeElement !== canvasRenderer.elt)) {
    return;
  }
  if (event && (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)) {
    return;
  }

  if (keyCode === 82) {
    skippedFrame = BASELINE_SETTINGS.skipFirstNFrame - 1000;
    const status = document.getElementById("simulation-status");
    if (status) {
      status.textContent = activeSettings.simSpeed === 0
        ? "Fast-forward queued. It will run when simulation speed is above 0."
        : "Fast-forward requested. The skipped-update loop may temporarily pause rendering.";
    }
    return false;
  }
  if (keyCode === 68) {
    const speed = activeSettings.simSpeed;
    const nextSpeed = speed <= 4 ? speed + 1 : speed + 10;
    updateSpeedControl(nextSpeed);
    return false;
  }
  if (keyCode === 65) {
    updateSpeedControl(Math.max(0, activeSettings.simSpeed - 10));
    return false;
  }
}

function updateSpeedControl(speed) {
  const input = document.getElementById("simulation-speed");
  if (!input) {
    return;
  }
  input.value = String(speed);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function draw() {
  background(220);
  if (!simulation) {
    return;
  }

  for (let i = 0; i < SETTINGS.simSpeed; i++) {
    simulation.update();

    if (skippedFrame < SETTINGS.skipFirstNFrame) {
      skippedFrame++;
      i--;
    }
  }

  simulation.display();
}

if (typeof window.p5 !== "function") {
  reportInitializationFailure(new Error("The bundled p5.js dependency did not load."));
}
if (typeof window.ProjectPage?.connect !== "function") {
  reportInitializationFailure(new Error("The shared project-page controller did not load."));
}
installSpeedValidation();
