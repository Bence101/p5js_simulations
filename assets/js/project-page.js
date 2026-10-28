"use strict";

window.ProjectPage = (() => {
  let connected = false;

  function connect(adapter) {
    if (connected) {
      throw new Error("A project page can connect only one simulation adapter.");
    }
    if (typeof adapter?.applySettings !== "function" || typeof adapter?.restart !== "function") {
      throw new Error("The simulation adapter must implement applySettings(settings) and restart(settings).");
    }

    const form = document.getElementById("simulation-controls");
    const fields = document.getElementById("simulation-fields");
    const reset = document.getElementById("reset-everything");
    const restart = document.getElementById("restart-simulation");
    const status = document.getElementById("simulation-status");
    if (!(form instanceof HTMLFormElement) || !(fields instanceof HTMLFieldSetElement)
      || !(reset instanceof HTMLButtonElement) || !(restart instanceof HTMLButtonElement) || !status) {
      throw new Error("Project page markup is not ready. Load project-shell.js before the simulation setup.");
    }
    if (fields.form !== form || reset.form !== form || reset.type !== "reset" || restart.type !== "button") {
      throw new Error("Project page controls must preserve the shared form and reset/restart button contract.");
    }
    const controls = [...form.querySelectorAll("input[name], select[name], textarea[name]")];
    let settings;

    function synchronize() {
      settings = {};
      for (const control of controls) {
        if (control.type === "radio" && !control.checked) {
          continue;
        }
        let value = control.value;
        if (control.type === "checkbox") {
          value = control.checked;
        } else if (control.type === "range" || control.type === "number") {
          value = control.valueAsNumber;
          if (!Number.isFinite(value)) {
            throw new Error(`The "${control.name}" control must contain a number.`);
          }
        }
        settings[control.name] = value;
      }

      for (const output of form.querySelectorAll("output[for]")) {
        const control = controls.find((field) => field.id === output.getAttribute("for"));
        if (control) {
          output.value = String(settings[control.name]);
        }
      }
      adapter.applySettings({ ...settings });
    }

    function restartSimulation() {
      synchronize();
      adapter.restart({ ...settings });
    }

    // Keep controls disabled until both initial settings and the simulation are ready.
    restartSimulation();
    connected = true;
    fields.disabled = false;
    restart.disabled = false;
    reset.disabled = false;
    status.textContent = "Simulation ready.";

    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", synchronize);
    form.addEventListener("change", synchronize);
    restart.addEventListener("click", () => {
      restartSimulation();
      status.textContent = "Simulation restarted. Control values retained.";
    });
    form.addEventListener("reset", () => {
      // The native reset event runs before the browser restores HTML defaults.
      setTimeout(() => {
        restartSimulation();
        status.textContent = "All controls restored to defaults. Simulation restarted.";
      }, 0);
    });
  }

  return { connect };
})();
