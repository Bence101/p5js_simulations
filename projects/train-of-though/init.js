const TRAINSPEED = 0.020;
const TRAININTERVAL = 150;
const NSTATIONS = 8;
const nAllTrains = 20;
const forbidStackingJunctions = 1;
const BOARDSIZE = [7, 9];
const TILESIZE = 60;
const debuggingMode = 0;

let TRAINCOLORS;
let TRACKCOLOR;
let TRACKSWITCHCOLOR;
let BACKGROUNDCOLOR;

let SCORE = 0;
let nFinishedTrains = 0;
let nSpawnedTrains = 0;

let gameEnded = false;
let gameStarted = true;
let cntFrames = 0;

let tiles = [];
let trains = [];
let hud;
let boardGenerator;
let canvasRenderer;
let boardReady = false;
let boardFailureAttempts = 0;
let gameSetupComplete = false;
let gamePageConnected = false;
let clickSound;
let rattlingSound;
let hornSound;
let wrongStationSound;
let finishedSound;
let audioPending = 0;
let audioAttempt = 0;
let audioReady = false;
let audioUnlockRequested = false;
let audioAssetFailures = [];
const loadedAudioAssets = new Set();
const SOUND_ASSETS = [
  { name: "clickSound", path: "assets/click.mp3" },
  { name: "rattlingSound", path: "assets/rattling.mp3" },
  { name: "hornSound", path: "assets/horn.mp3" },
  { name: "wrongStationSound", path: "assets/wrongStation.mp3" },
  { name: "finishedSound", path: "assets/finished.mp3" },
];

function setGameStatus(message) {
  const status = document.getElementById("game-status");
  if (status) {
    status.textContent = message;
  }
}

function showInitializationRecovery(message) {
  setGameStatus(message);
  const button = document.getElementById("retry-initialization");
  if (button) {
    button.hidden = false;
    button.disabled = false;
  }
}

function setColors() {
  BACKGROUNDCOLOR = color(59, 107, 68);
  TRAINCOLORS = [
    color(227, 19, 97),
    color(253, 235, 23),
    color(51, 202, 255),
    color(73, 75, 71),
    color(201, 200, 196),
    color(160, 255, 50),
    color(50, 20, 200),
  ];
  TRACKCOLOR = color(205, 133, 63);
  TRACKSWITCHCOLOR = color(80, 127, 88, 100);
}