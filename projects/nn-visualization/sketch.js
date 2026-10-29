"use strict";

const datasetDefinitions = {
  doubleSpiral: {
    label: "Double spiral",
    inputNodes: 2,
    outputNodes: 1,
    generate: () => DataSetGenerator.generateDoubleSpiral()
  },
  sameSignQuadrants: {
    label: "Same-sign quadrants",
    inputNodes: 2,
    outputNodes: 1,
    generate: () => DataSetGenerator.generateData(1000, dataScale, DataSetGenerator.flagSplitter)
  },
  circle: {
    label: "Circle (radius 5)",
    inputNodes: 2,
    outputNodes: 1,
    generate: () => DataSetGenerator.generateData(1000, dataScale, DataSetGenerator.linearSplitter)
  }
};

const projectDefaults = {
  canvas: {
    width: 820,
    height: 600
  },
  controls: {
    applyMode: "immediate",
    dataset: "sameSignQuadrants",
    updatesPerFrame: 100,
    learningRate: 0.01,
    hiddenLayer1: 8,
    hiddenLayer2: 8,
    hiddenLayer3: 0,
    hiddenLayer4: 0,
    hiddenLayer5: 0,
    accuracyThreshold: 100
  }
};
const defaultModelSettings = readModelSettings(projectDefaults.controls);

let nn;
let nnVis;
let predictedBG;
let chart;
let layerSizes = getLayerSizes(defaultModelSettings);
let dataScale = [-10, 10, -10, 10];
let gridSizes = [30, 30];
let data;
let gridData;
let learningIteration = 0;
let updatesPerFrame = defaultModelSettings.updatesPerFrame;
let learningRate = defaultModelSettings.learningRate;
let accuracyThreshold = defaultModelSettings.accuracyThreshold;
let currentAccuracy = 0;
let activeDataset = defaultModelSettings.dataset;
let activeModelSettings = defaultModelSettings;
let applyMode = projectDefaults.controls.applyMode;
let accuracyThresholdArmed = true;
let pausedForAccuracy = false;
let settingsStatus;
let trainingStatus;
let resumeButton;

function setup() {
  const canvas = createCanvas(projectDefaults.canvas.width, projectDefaults.canvas.height);
  canvas.parent("sketch");

  chart = new Chart(createVector(20, 200), 380, 380);
  nnVis = new NeuralNetworkVisual(createVector(420, 200), 380, 380);
  generateDataset(defaultModelSettings.dataset);
  bindProjectControls();

  ProjectPage.connect({
    canvas,
    defaults: projectDefaults.controls,
    applySettings,
    restart
  });
}

function bindProjectControls() {
  const controls = document.getElementById("simulation-controls");
  const modeInput = document.getElementById("apply-mode");
  const modeToggle = document.getElementById("apply-mode-toggle");
  const modeDescription = document.getElementById("apply-mode-description");
  settingsStatus = document.getElementById("settings-status");
  trainingStatus = document.getElementById("training-status");
  resumeButton = document.getElementById("resume-training");

  if (!(controls instanceof HTMLFormElement)
      || !(modeInput instanceof HTMLInputElement)
      || !(modeToggle instanceof HTMLButtonElement)
      || !(modeDescription instanceof HTMLParagraphElement)
      || !(settingsStatus instanceof HTMLParagraphElement)
      || !(trainingStatus instanceof HTMLParagraphElement)
      || !(resumeButton instanceof HTMLButtonElement)) {
    throw new Error("The neural-network project controls are missing or have unexpected element types.");
  }

  controls.addEventListener("input", normalizeNumberControl, true);
  controls.addEventListener("change", normalizeNumberControl, true);
  modeToggle.addEventListener("click", () => {
    modeInput.value = modeInput.value === "immediate" ? "afterRestart" : "immediate";
    syncApplyModeControl(modeInput.value, modeToggle, modeDescription);
    modeInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
  resumeButton.addEventListener("click", resumeTraining);
  modeInput.value = projectDefaults.controls.applyMode;
  syncApplyModeControl(modeInput.value, modeToggle, modeDescription);
}

function normalizeNumberControl(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "number") {
    return;
  }

  const value = input.valueAsNumber;
  const minValue = Number(input.min);
  const maxValue = Number(input.max);
  const step = Number(input.step);
  if (!Number.isFinite(value)) {
    input.setCustomValidity("Enter a number within the displayed bounds.");
    const label = input.labels && input.labels.length > 0
      ? input.labels[0].textContent.trim()
      : input.id;
    setSettingsStatus(`${label} must be a number between ${minValue} and ${maxValue}.`);
    event.stopPropagation();
    return;
  }

  const boundedValue = Math.min(maxValue, Math.max(minValue, value));
  const normalizedValue = Number((minValue + Math.round((boundedValue - minValue) / step) * step).toFixed(8));
  input.value = String(normalizedValue);
  input.setCustomValidity("");
}

function syncApplyModeControl(mode, modeToggle, modeDescription) {
  if (mode !== "immediate" && mode !== "afterRestart") {
    throw new Error(`Unknown settings application mode: ${mode}`);
  }

  const applyAfterRestart = mode === "afterRestart";
  applyMode = mode;
  modeToggle.setAttribute("aria-checked", String(applyAfterRestart));
  modeToggle.textContent = applyAfterRestart ? "Apply after restart" : "Apply immediately";
  modeDescription.textContent = applyAfterRestart
    ? "Changes below are held until you choose Restart Simulation."
    : "Changes below take effect as you make them.";
}

function readModelSettings(settings) {
  const dataset = datasetDefinitions[settings.dataset];
  if (!dataset) {
    throw new Error(`Unknown neural-network dataset: ${settings.dataset}`);
  }

  const hiddenLayers = [
    settings.hiddenLayer1,
    settings.hiddenLayer2,
    settings.hiddenLayer3,
    settings.hiddenLayer4,
    settings.hiddenLayer5
  ];
  if (!hiddenLayers.every((nodes) => Number.isInteger(nodes) && nodes >= 0 && nodes <= 9)) {
    throw new Error("Each hidden layer must contain an integer number of nodes from 0 to 9.");
  }
  if (!Number.isInteger(settings.updatesPerFrame) || settings.updatesPerFrame < 1 || settings.updatesPerFrame > 500) {
    throw new Error("Training updates per frame must be an integer from 1 to 500.");
  }
  if (!Number.isFinite(settings.learningRate) || settings.learningRate < 0.001 || settings.learningRate > 0.1) {
    throw new Error("The learning rate must be between 0.001 and 0.1.");
  }
  if (!Number.isInteger(settings.accuracyThreshold) || settings.accuracyThreshold < 1 || settings.accuracyThreshold > 100) {
    throw new Error("The accuracy threshold must be an integer percentage from 1 to 100.");
  }

  return {
    dataset: settings.dataset,
    hiddenLayers,
    updatesPerFrame: settings.updatesPerFrame,
    learningRate: settings.learningRate,
    accuracyThreshold: settings.accuracyThreshold
  };
}

function getLayerSizes(modelSettings) {
  const dataset = datasetDefinitions[modelSettings.dataset];
  return [
    dataset.inputNodes,
    ...modelSettings.hiddenLayers.filter((nodes) => nodes > 0),
    dataset.outputNodes
  ];
}

function arraysEqual(first, second) {
  return first.length === second.length && first.every((value, index) => value === second[index]);
}

function modelSettingsMatch(first, second) {
  return first.dataset === second.dataset
    && first.updatesPerFrame === second.updatesPerFrame
    && first.learningRate === second.learningRate
    && first.accuracyThreshold === second.accuracyThreshold
    && arraysEqual(first.hiddenLayers, second.hiddenLayers);
}

function applyModelSettings(next) {
  const nextLayerSizes = getLayerSizes(next);
  const datasetChanged = next.dataset !== activeDataset;
  const architectureChanged = !arraysEqual(nextLayerSizes, layerSizes);

  if (datasetChanged) {
    generateDataset(next.dataset);
  }

  activeDataset = next.dataset;
  layerSizes = nextLayerSizes;
  updatesPerFrame = next.updatesPerFrame;
  learningRate = next.learningRate;
  accuracyThreshold = next.accuracyThreshold;

  const networkRebuilt = Boolean(nn && (datasetChanged || architectureChanged));
  if (networkRebuilt) {
    createFreshNetwork();
  } else if (nn) {
    nn.learningRate = learningRate;
  }

  return { datasetChanged, architectureChanged, networkRebuilt };
}

function applySettings(settings) {
  const modeToggle = document.getElementById("apply-mode-toggle");
  const modeDescription = document.getElementById("apply-mode-description");
  syncApplyModeControl(settings.applyMode, modeToggle, modeDescription);

  const next = readModelSettings(settings);
  if (applyMode === "afterRestart") {
    setSettingsStatus(modelSettingsMatch(next, activeModelSettings)
      ? "Changes are held until Restart Simulation."
      : "You have staged changes. Choose Restart Simulation to apply them.");
    return;
  }

  const wasPaused = pausedForAccuracy;
  const changes = applyModelSettings(next);
  activeModelSettings = next;
  if (changes.datasetChanged) {
    setTrainingStatus("The dataset changed; a new data set, grid, and network are active.");
  } else if (changes.architectureChanged) {
    setTrainingStatus("The network architecture changed; a freshly initialized network is active.");
  }
  setSettingsStatus("Changes are applied immediately.");

  if (wasPaused && changes.networkRebuilt) {
    resumeAfterNetworkReset();
  } else if (wasPaused && currentAccuracy * 100 < accuracyThreshold) {
    resumeTraining();
  } else if (!pausedForAccuracy) {
    pauseAtAccuracyThreshold(currentAccuracy);
  }
}

function restart(settings) {
  const modeToggle = document.getElementById("apply-mode-toggle");
  const modeDescription = document.getElementById("apply-mode-description");
  syncApplyModeControl(settings.applyMode, modeToggle, modeDescription);

  const wasPaused = pausedForAccuracy;
  const next = readModelSettings(settings);
  const changes = applyModelSettings(next);
  activeModelSettings = next;
  if (!changes.networkRebuilt) {
    createFreshNetwork();
  }

  setSettingsStatus("Selected settings are now active.");
  setTrainingStatus("Training restarted with a fresh network; the learning-iteration count is zero.");

  if (wasPaused) {
    resumeAfterNetworkReset();
  } else {
    resumeButton.disabled = true;
  }
}

function generateDataset(datasetKey) {
  const dataset = datasetDefinitions[datasetKey];
  if (!dataset) {
    throw new Error(`Cannot generate an unknown dataset: ${datasetKey}`);
  }

  data = dataset.generate();
  gridData = DataSetGenerator.generateGrid(gridSizes, dataScale);
}

function createFreshNetwork() {
  nn = new NeuralNetwork([...layerSizes]);
  nn.learningRate = learningRate;
  learningIteration = 0;
  currentAccuracy = 0;
  accuracyThresholdArmed = true;
}

function setSettingsStatus(message) {
  if (settingsStatus.textContent !== message) {
    settingsStatus.textContent = message;
  }
}

function setTrainingStatus(message) {
  if (trainingStatus.textContent !== message) {
    trainingStatus.textContent = message;
  }
}

function pauseAtAccuracyThreshold(accuracy) {
  currentAccuracy = accuracy;
  if (accuracy * 100 < accuracyThreshold) {
    accuracyThresholdArmed = true;
    return;
  }
  if (!accuracyThresholdArmed || pausedForAccuracy) {
    return;
  }

  pausedForAccuracy = true;
  accuracyThresholdArmed = false;
  noLoop();
  resumeButton.disabled = false;
  setTrainingStatus(`Training paused at ${Math.round(accuracy * 100)}% accuracy.`);
}

function resumeTraining() {
  if (!pausedForAccuracy) {
    return;
  }

  pausedForAccuracy = false;
  accuracyThresholdArmed = currentAccuracy * 100 < accuracyThreshold;
  resumeButton.disabled = true;
  setTrainingStatus("Training resumed with the current network.");
  loop();
}

function resumeAfterNetworkReset() {
  if (!pausedForAccuracy) {
    return;
  }

  pausedForAccuracy = false;
  accuracyThresholdArmed = true;
  resumeButton.disabled = true;
  loop();
}

function draw() {
  background(220);

  for (let i = 0; i < updatesPerFrame; i++) {
    const sampleIndex = Math.floor(Math.random() * data[0].length);
    nn.learn(data[0][sampleIndex], data[1][sampleIndex]);
    learningIteration++;
  }

  const predictedData = [];
  for (const gridPoint of gridData) {
    predictedData.push(nn.predict(gridPoint));
  }

  nnVis.update(nn.layerSizes, nn.getBiasLists(), nn.getWeightTables(), nn.lastNetworkActivationValues);
  chart.update(data[0], data[1], gridData, predictedData, dataScale, gridSizes);

  push();
    fill(0);
    text("FPS: " + str(round(getFrameRate())), 20, 30);
    text("Learning iteration: " + str(learningIteration), 20, 55);
    text("Accuracy: " + str(round(currentAccuracy, 2)), 20, 80);
    text("Dataset: " + datasetDefinitions[activeDataset].label, 20, 105);
    text("Network architecture: " + layerSizes.join(" -> "), 20, 130);
    text("Decision surface", 20, 175);
    text("The points represets the dataset samples", 30, 190);
    text("Network graph", 420, 175);
  pop();

  nnVis.display();
  chart.display();
  pauseAtAccuracyThreshold(nn.calculateAccuracy(data[0], data[1]));
  fill(0);
  text("Accuracy: " + str(round(currentAccuracy, 2)), 20, 80);
}
