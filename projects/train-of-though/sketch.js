function setup() {
  canvasRenderer = createCanvas(BOARDSIZE[0] * TILESIZE, BOARDSIZE[1] * TILESIZE);
  canvasRenderer.parent("sketch");
  setColors();
  hud = new MyHud();

  document.getElementById("regenerate-board").addEventListener("click", regenerateBoard);
  document.getElementById("full-screen").addEventListener("click", setFullScreen);
  document.getElementById("retry-initialization").addEventListener("click", retryInitialization);
  document.addEventListener("pointerdown", enableAudioAfterGesture);
  document.addEventListener("keydown", enableAudioAfterGesture);
  document.addEventListener("fullscreenchange", updateFullScreenButton);

  gameSetupComplete = true;
  const result = createNewBoard();
  boardReady = result.success;
  boardFailureAttempts = result.success ? 0 : result.attempts;
  noLoop();
  soundFormats("mp3", "wav");
  loadSoundAssets(SOUND_ASSETS);
  completeGameInitialization();
}

function draw() {
  background(BACKGROUNDCOLOR);
  
  if (gameStarted && !gameEnded && boardReady) {
    if (nSpawnedTrains < nAllTrains
      && (cntFrames % TRAININTERVAL === 0 || cntFrames === 0)) {
      trains.push(new Train(tiles[0]));
      nSpawnedTrains += 1;
    }

    trains.forEach((object) => object.update(tiles));
  }

  tiles.forEach((object) => object.display());
  trains.forEach((object) => object.display());
  hud.update();
  hud.display();
  
  cntFrames += 1;
  
  if (gameEnded) {
    showFinishText();
  }  
}

function createNewBoard() {
  const newTiles = [];
  const newGenerator = new BoardGenerator(
    newTiles,
    NSTATIONS,
    BOARDSIZE,
    forbidStackingJunctions,
  );
  const result = newGenerator.generateBoard();
  if (result.success) {
    tiles = newTiles;
    boardGenerator = newGenerator;
  }
  return result;
}

function completeGameInitialization() {
  if (!gameSetupComplete || gamePageConnected || audioPending > 0) {
    return;
  }

  if (!boardReady) {
    const audioProblem = audioAssetFailures.length > 0
      ? ` Sound files could not be loaded: ${audioAssetFailures.map((asset) => asset.path).join(", ")}.`
      : "";
    showInitializationRecovery(
      `The board could not be completed after ${boardFailureAttempts} attempts.${audioProblem} Retry initialization; the game controls remain disabled.`,
    );
    return;
  }
  if (audioAssetFailures.length > 0) {
    const failedAssets = audioAssetFailures.map((asset) => asset.path).join(", ");
    showInitializationRecovery(
      `Sound files could not be loaded: ${failedAssets}. Check the connection and retry initialization. The game controls remain disabled.`,
    );
    return;
  }
  if (!audioReady) {
    showInitializationRecovery(
      "Sound effects are not ready yet. Retry initialization; the game controls remain disabled.",
    );
    return;
  }
  try {
    ProjectPage.connect({
      canvas: canvasRenderer,
      applySettings: applyGameSettings,
      restart: restartGame,
      reset: resetEverything,
    });
    gamePageConnected = true;
  } catch (error) {
    showInitializationRecovery(
      "The game could not finish initializing. Check the browser console, then retry initialization.",
    );
    throw error;
  }

  const recoveryButton = document.getElementById("retry-initialization");
  recoveryButton.hidden = true;
  recoveryButton.disabled = true;
  setGameStatus("Game ready. Trains run automatically; sound starts after your first interaction.");
}

function applyGameSettings(settings) {
  if (settings === null || typeof settings !== "object" || Object.keys(settings).length !== 0) {
    throw new Error("Train of Thought has no editable game settings.");
  }
}

function retryInitialization() {
  const retryButton = document.getElementById("retry-initialization");
  retryButton.disabled = true;
  setGameStatus("Retrying board and sound initialization...");

  if (!boardReady) {
    const result = createNewBoard();
    if (!result.success) {
      boardFailureAttempts = result.attempts;
      completeGameInitialization();
      return;
    }
    boardReady = true;
    boardFailureAttempts = 0;
  }

  if (audioAssetFailures.length > 0) {
    loadSoundAssets(audioAssetFailures.slice());
    return;
  }
  completeGameInitialization();
}
