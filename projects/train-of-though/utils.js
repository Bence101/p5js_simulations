function loadSoundAssets(assets) {
  const attempt = ++audioAttempt;
  audioPending = assets.length;
  audioAssetFailures = [];
  audioReady = false;
  if (assets.length === 0) {
    audioReady = loadedAudioAssets.size === SOUND_ASSETS.length;
    completeGameInitialization();
    return;
  }

  for (const asset of assets) {
    let settled = false;
    const sound = loadSound(
      asset.path,
      () => {
        if (attempt !== audioAttempt || settled) {
          return;
        }
        settled = true;
        loadedAudioAssets.add(asset.name);
        finishSoundAssetLoad();
      },
      () => {
        if (attempt !== audioAttempt || settled) {
          return;
        }
        settled = true;
        audioAssetFailures.push(asset);
        finishSoundAssetLoad();
      },
    );
    assignSoundAsset(asset.name, sound);
  }
}

function assignSoundAsset(name, sound) {
  if (name === "clickSound") {
    clickSound = sound;
  } else if (name === "rattlingSound") {
    rattlingSound = sound;
  } else if (name === "hornSound") {
    hornSound = sound;
  } else if (name === "wrongStationSound") {
    wrongStationSound = sound;
  } else if (name === "finishedSound") {
    finishedSound = sound;
  } else {
    throw new Error(`Unknown game sound: ${name}`);
  }
}

function finishSoundAssetLoad() {
  audioPending -= 1;
  if (audioPending === 0) {
    audioReady = audioAssetFailures.length === 0
      && loadedAudioAssets.size === SOUND_ASSETS.length;
    if (gameSetupComplete) {
      completeGameInitialization();
    }
  }
}

function enableAudioAfterGesture() {
  if (!gamePageConnected || !audioReady) {
    return;
  }
  audioUnlockRequested = true;
  if (getAudioContext().state === "running") {
    startRattlingSound();
    return;
  }
  userStartAudio()
    .then(startRattlingSound)
    .catch(() => {
      setGameStatus("The game is playable, but browser audio is unavailable until audio is allowed.");
    });
}

function startRattlingSound() {
  if (gameStarted && !gameEnded && rattlingSound.isLoaded() && !rattlingSound.isPlaying()) {
    rattlingSound.loop();
  }
}

function playGameSound(sound) {
  if (!sound || !sound.isLoaded()) {
    return;
  }
  if (getAudioContext().state === "running") {
    sound.play();
    return;
  }
  if (!audioUnlockRequested) {
    return;
  }
  userStartAudio()
    .then(() => sound.play())
    .catch(() => {
      setGameStatus("The game is playable, but browser audio is unavailable until audio is allowed.");
    });
}


// color functions
function getColorsByType(typeInput) {
  // typeInput==0 -> track tile, not station!
  let type = typeInput - 1;
  let nTypes = TRAINCOLORS.length;
  let trainColorsShifted = [...TRAINCOLORS];
  let removedElement = trainColorsShifted.shift();
  trainColorsShifted.push(removedElement);
  
  if (type <= nTypes-1) {
    return [TRAINCOLORS[type], TRAINCOLORS[type]]
  } 
  if ((type > nTypes-1) && (type <= nTypes*2-1)) {
    return [TRAINCOLORS[type - nTypes], trainColorsShifted[type - nTypes]]
  } 
  // not valid input:
  return [color(255, 0, 0), color(255, 0, 0)]
}

// function runTestColors() {
//   // később törölhető
//   for (let i=1; i<15; i++) {
//     let myColors = getColorsByType(i)
//     push();
//       noStroke();
//       fill(myColors[0])
//       rect(10, 15*i, 15, 15)
//       fill(myColors[1])
//       rect(25, 15*i, 15, 15)
//     pop();
//   }
// }

function mouseClicked() {
  if (boardReady) {
    tiles.forEach((object) => object.clicked(mouseX, mouseY));
    addTrainByClick(mouseX, mouseY);
  }
}

function restartGame() {
  applyGameSettings({});
  startRound();
  setGameStatus("Game restarted on the current board. Junction routes are unchanged.");
}

function resetEverything() {
  applyGameSettings({});
  for (const tile of tiles) {
    tile.currentEndSide = 0;
    tile.endPoint = tile.endPointA;
  }
  startRound();
  setGameStatus("Game reset to its code defaults. Junction routes are back to their starting exits.");
}

function startRound() {
  resetGame();
  cntFrames = 0;
  nSpawnedTrains = 0;
  gameStarted = true;
  loop();
  if (audioUnlockRequested && getAudioContext().state === "running") {
    startRattlingSound();
  }
}

function regenerateBoard() {
  const result = createNewBoard();
  if (!result.success) {
    setGameStatus(
      `The board could not be completed after ${result.attempts} attempts. Your current board and round are still running; select Regenerate Board to try again.`,
    );
    return;
  }

  boardReady = true;
  startRound();
  setGameStatus("Board regenerated. A fresh round is running on the new layout.");
}

function setFullScreen() {
  fullscreen(!fullscreen());
}

function updateFullScreenButton() {
  const button = document.getElementById("full-screen");
  if (button) {
    button.textContent = Boolean(fullscreen()) ? "Exit Full Screen" : "Full Screen";
  }
}

function keyPressed(event) {
  if (event.target instanceof Element
    && event.target.closest("input, select, textarea, button, [contenteditable='true']")) {
    return;
  }
  const pressedKey = key.toLowerCase();
  if (pressedKey === "g") {
    regenerateBoard();
  }
  if (pressedKey === "s") {
    restartGame();
  }
}

function addTrainByClick(x, y) {
  let startTile = tiles[0];
  if (startTile.onIt(x, y) && debuggingMode) {
    trains.push(new Train(startTile));
    nSpawnedTrains += 1;
  }
}

function resetGame() {
  gameStarted = false;
  gameEnded = false;
  trains.length = 0;
  SCORE = 0;
  nFinishedTrains = 0;
}

function gameEndTest() {
  if (nFinishedTrains >= nAllTrains) {
    if (rattlingSound.isPlaying()) {
      rattlingSound.stop();
    }
    playGameSound(finishedSound);
    gameEnded = true;
    setGameStatus(`Game over. Final score: ${SCORE}/${nAllTrains * 10}. Restart or regenerate to play again.`);
  }
}

function showFinishText() {
  push();
    translate(width/2, height/2);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(color(59,107,100, 180));
    rect(0, 0, 300, 100);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Game Over", 0, -14);
    textSize(20);
    text(`Score: ${SCORE}/${nAllTrains * 10}`, 0, 19);
  pop();
  noLoop();
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}