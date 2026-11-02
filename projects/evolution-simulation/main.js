
function setup() {
  try {
    canvas = createCanvas(SETTINGS.general.canvasWidth, SETTINGS.general.canvasHeight);
    canvas.parent("sketch");
    initialSettings = JSON.parse(JSON.stringify(SETTINGS));

    simulation = new Simulation(SETTINGS);
    HUD = new InnerHud(simulation);
    ViewTransformer.restore(viewTransformerControls, SETTINGS, true);

    window.ProjectPage.connect({
      canvas,
      defaults: projectSettingDefaults(),
      applySettings: applySimulationSettings,
      restart: (settings) => restartSimulation(settings, true),
      reset: (settings) => resetSimulation(settings)
    });
  } catch (error) {
    const status = document.getElementById("simulation-status");
    if (status) {
      const detail = error instanceof Error ? error.message : String(error);
      status.textContent = `Simulation initialization failed: ${detail}`;
    }
    throw error;
  }
}

function projectSettingDefaults() {
  const eyesight = SETTINGS.simulation.creatureProperties.eyesight;
  return {
    nCreatures: SETTINGS.simulation.nCreatures,
    viewDistance: eyesight.viewDistance,
    fieldOfView: eyesight.fieldOfView,
    drawRays: Boolean(eyesight.drawRays),
    drawFieldOfView: Boolean(eyesight.drawFieldOfView),
    showAvoidSegmentGuides: Boolean(SETTINGS.debug.showAvoidSegmentGuides),
    showObstacleDebugTriangles: Boolean(SETTINGS.debug.showObstacleDebugTriangles)
  };
}

function applySimulationSettings(settings) {
  SETTINGS.simulation.nCreatures = settings.nCreatures;
  const eyesightSettings = SETTINGS.simulation.creatureProperties.eyesight;
  eyesightSettings.viewDistance = settings.viewDistance;
  eyesightSettings.fieldOfView = settings.fieldOfView;
  eyesightSettings.drawRays = settings.drawRays;
  eyesightSettings.drawFieldOfView = settings.drawFieldOfView;
  SETTINGS.debug.showAvoidSegmentGuides = settings.showAvoidSegmentGuides;
  SETTINGS.debug.showObstacleDebugTriangles = settings.showObstacleDebugTriangles;

  if (simulation) {
    for (const creature of simulation.creatures) {
      creature.eyesight.viewDistance = settings.viewDistance;
      creature.eyesight.fieldOfView = settings.fieldOfView;
      creature.eyesight.drawRays = settings.drawRays;
      creature.eyesight.drawFieldOfView = settings.drawFieldOfView;
    }
  }
}

function restartSimulation(settings, preserveBoardEdits) {
  applySimulationSettings(settings);
  const userObstacles = preserveBoardEdits && simulation
    ? simulation.board.obstacles
      .filter((obstacle) => obstacle.userCreated)
      .map((obstacle) => ({
        x: obstacle.posStart.x,
        y: obstacle.posStart.y,
        w: obstacle.width,
        h: obstacle.height
      }))
    : [];

  simulation = new Simulation(SETTINGS);
  for (const obstacle of userObstacles) {
    const restoredObstacle = simulation.board.addObstacle(
      createVector(obstacle.x, obstacle.y),
      [obstacle.w, obstacle.h],
      SETTINGS
    );
    restoredObstacle.userCreated = true;
  }
  HUD = new InnerHud(simulation);
}

function resetSimulation(settings) {
  SETTINGS = JSON.parse(JSON.stringify(initialSettings));
  loop();
  ViewTransformer.restore(viewTransformerControls, SETTINGS, true);
  restartSimulation(settings, false);
}

function draw() {
  background(color(200, 200, 200));
  stroke(color(200));

  let skippedFrame = SETTINGS.fastForwardFrameAmount;
  if (SETTINGS.fastForward) {
    skippedFrame = 0;
    SETTINGS.fastForward = 0;
  }

  for (let i = 0; i < SETTINGS.simSpeed; i++) {
    simulation.update();
    HUD.update();
    if (skippedFrame < SETTINGS.fastForwardFrameAmount) {
      skippedFrame++;
      i--;
    }
  }

  push();
    scale(viewTransformerControls.view.zoom);
    translate(viewTransformerControls.view.x, viewTransformerControls.view.y);
    simulation.display();
  pop();

  HUD.display();
  boardManipulator.display(mouseX, mouseY);
  steerFirstCreature();
}

function steerFirstCreature() {
  if (!simulation || !simulation.creatures[0]) {
    return;
  }
  const creature = simulation.creatures[0];
  if (keyIsDown(LEFT_ARROW)) {
    creature.mover.directSteering(-1);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    creature.mover.directSteering(1);
  }
  if (keyIsDown(UP_ARROW)) {
    creature.mover.directSpeedChange(1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    creature.mover.directSpeedChange(-1);
  }
  if (keyIsDown(81)) {
    creature.mover.vel.setMag(0);
  }
}

