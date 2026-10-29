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
    const stage = document.getElementById("sketch");
    if (!(form instanceof HTMLFormElement) || !(fields instanceof HTMLFieldSetElement)
      || !(reset instanceof HTMLButtonElement) || !(restart instanceof HTMLButtonElement) || !status || !stage) {
      throw new Error("Project page markup is not ready. Load project-shell.js before the simulation setup.");
    }
    if (fields.form !== form || reset.form !== form || reset.type !== "reset" || restart.type !== "button") {
      throw new Error("Project page controls must preserve the shared form and reset/restart button contract.");
    }
    if (stage.dataset.sizing === "fixed") {
      const canvas = adapter.canvas;
      if (!(canvas?.elt instanceof HTMLCanvasElement) || canvas.elt.parentElement !== stage
        || !Number.isFinite(canvas.width) || canvas.width <= 0
        || !Number.isFinite(canvas.height) || canvas.height <= 0) {
        throw new Error("A fixed-size adapter must provide the p5 canvas returned by createCanvas(), parented to #sketch, with positive finite logical dimensions.");
      }
      stage.style.setProperty("--canvas-logical-width", `${canvas.width}px`);
      stage.style.setProperty("--canvas-aspect-ratio", `${canvas.width} / ${canvas.height}`);
    }
    const controls = [...form.querySelectorAll("input[name], select[name], textarea[name]")];
    let settings;

    function setControlDefaults(defaults) {
      if (defaults === null || typeof defaults !== "object" || Array.isArray(defaults)) {
        throw new Error("Project defaults must be an object keyed by named form controls.");
      }

      for (const [name, value] of Object.entries(defaults)) {
        const group = controls.filter((control) => control.name === name);
        if (group.length === 0) {
          throw new Error(`The default "${name}" does not match a named project control.`);
        }

        const radioGroup = group.every((control) =>
          control instanceof HTMLInputElement && control.type === "radio");
        if (radioGroup) {
          const selected = group.find((control) => control.value === String(value));
          if (!selected) {
            throw new Error(`The default "${name}" must match one of its radio options.`);
          }
          for (const control of group) {
            control.defaultChecked = control === selected;
            control.checked = control === selected;
          }
          continue;
        }

        if (group.length !== 1) {
          throw new Error(`The default "${name}" must match one control or a radio group.`);
        }

        const control = group[0];
        if (control instanceof HTMLInputElement && control.type === "checkbox") {
          if (typeof value !== "boolean") {
            throw new Error(`The checkbox default "${name}" must be a boolean.`);
          }
          control.defaultChecked = value;
          control.checked = value;
        } else if (control instanceof HTMLSelectElement) {
          if (control.multiple) {
            throw new Error(`The "${name}" control must not be a multi-select.`);
          }
          const selected = [...control.options].find((option) => option.value === String(value));
          if (!selected) {
            throw new Error(`The default "${name}" must match one of its select options.`);
          }
          for (const option of control.options) {
            option.defaultSelected = option === selected;
            option.selected = option === selected;
          }
        } else if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
          if (control instanceof HTMLInputElement && control.type === "file") {
            throw new Error(`The "${name}" control cannot use a project default.`);
          }
          control.value = String(value);
          control.defaultValue = control.value;
        } else {
          throw new Error(`The "${name}" control type does not support project defaults.`);
        }
      }
    }

    if (adapter.defaults !== undefined) {
      setControlDefaults(adapter.defaults);
    }

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
