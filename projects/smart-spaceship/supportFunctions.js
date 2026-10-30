function skipNextNGen() {
  SKIPNGEN=currentGen+1;
}

function createHUD() {
  const skipButton = document.getElementById("skip-next-generation");
  const resetSpeedButton = document.getElementById("reset-sim-speed");
  const speedInput = document.getElementById("sim-speed");

  if (!(skipButton instanceof HTMLButtonElement)
    || !(resetSpeedButton instanceof HTMLButtonElement)
    || !(speedInput instanceof HTMLInputElement)) {
    throw new Error("Smart Spaceship controls are missing from the project page.");
  }

  skipButton.addEventListener("click", skipNextNGen);
  resetSpeedButton.addEventListener("click", () => {
    speedInput.value = String(DEFAULTS.simSpeed);
    speedInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
