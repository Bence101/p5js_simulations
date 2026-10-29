"use strict";

(() => {
  const roots = document.querySelectorAll("[data-project-page]");
  if (roots.length === 0) {
    return;
  }
  if (roots.length !== 1) {
    throw new Error("A project page must have exactly one data-project-page root.");
  }

  const root = roots[0];
  if (root.hasAttribute("data-project-mounted")) {
    throw new Error("The shared project shell can mount only once.");
  }
  if (!["sidebar", "stacked"].includes(root.dataset.layout)) {
    throw new Error('Choose data-layout="sidebar" or data-layout="stacked" on the project root.');
  }
  if (!root.dataset.sourceUrl) {
    throw new Error("The project root must declare its data-source-url.");
  }
  const sourceUrl = new URL(root.dataset.sourceUrl);
  if (sourceUrl.protocol !== "https:") {
    throw new Error("The project source URL must be an absolute HTTPS URL.");
  }

  const requiredSlots = ["intro", "canvas", "controls", "help"];
  const optionalSlots = ["background", "next-steps", "extra"];
  const slots = new Map();
  for (const child of root.children) {
    const name = child.dataset.projectSlot;
    if (name === undefined && child.hasAttribute("data-project-fallback")) {
      continue;
    }
    if (![...requiredSlots, ...optionalSlots].includes(name)) {
      throw new Error("Each direct project child must have a supported data-project-slot or data-project-fallback.");
    }
    if (slots.has(name)) {
      throw new Error(`The "${name}" project slot must appear only once.`);
    }
    slots.set(name, child);
  }
  for (const name of requiredSlots) {
    if (!slots.has(name)) {
      throw new Error(`The project page is missing its "${name}" slot.`);
    }
  }
  const controls = slots.get("controls");
  if (!(controls instanceof HTMLFieldSetElement) || !controls.disabled) {
    throw new Error("The controls slot must be a disabled fieldset with its own legend.");
  }
  if (!controls.querySelector(":scope > legend")) {
    throw new Error("The controls slot must have a legend describing the project controls.");
  }
  const canvas = slots.get("canvas");
  if (canvas.id !== "sketch" || !canvas.classList.contains("sketch-stage")) {
    throw new Error('The canvas slot must be the #sketch.sketch-stage host.');
  }
  if (!["fixed", "responsive"].includes(canvas.dataset.sizing)) {
    throw new Error("The canvas host must declare fixed or responsive data-sizing.");
  }

  const template = document.createElement("template");
  template.innerHTML = `
    <a class="project-link" href="../../index.html">&larr; Back to Portfolio</a>
    <div data-shell-slot="intro"></div>
    <div class="project-actions">
      <button id="reset-everything" class="button--primary" type="reset" form="simulation-controls" disabled>Reset Everything</button>
    </div>
    <div class="project-workspace">
      <div data-shell-slot="canvas"></div>
      <form id="simulation-controls" class="simulation-controls" aria-labelledby="controls-title">
        <h2 id="controls-title">Controls</h2>
        <fieldset id="simulation-fields" disabled aria-labelledby="controls-title">
          <div data-shell-slot="controls"></div>
          <div class="simulation-standard-actions">
            <button id="restart-simulation" type="button" disabled>Restart Simulation</button>
          </div>
        </fieldset>
        <p id="simulation-status" class="simulation-status" role="status">Simulation not connected. Controls stay disabled until initialization succeeds.</p>
      </form>
    </div>
    <section class="simulation-help" aria-labelledby="how-to-use">
      <h2 id="how-to-use">How to Use</h2>
      <div data-shell-slot="help"></div>
    </section>
    <section class="project-information" aria-labelledby="project-information">
      <h2 id="project-information">Project Information</h2>
      <section aria-labelledby="project-background">
        <h3 id="project-background">Background and References</h3>
        <div data-shell-slot="background">
          <div class="empty-content">Content intentionally left empty for a future update.</div>
        </div>
      </section>
      <section aria-labelledby="next-steps">
        <h3 id="next-steps">Next Steps</h3>
        <div data-shell-slot="next-steps">
          <div class="empty-content">Content intentionally left empty for a future update.</div>
        </div>
      </section>
    </section>
    <div data-shell-slot="extra"></div>
    <footer class="project-source">
      <a data-project-source>View Project Source on GitHub</a>
    </footer>
  `;

  const fragment = template.content;
  for (const element of fragment.querySelectorAll("[id]")) {
    if (document.getElementById(element.id)) {
      throw new Error(`The "${element.id}" ID belongs to the shared shell, not project content.`);
    }
  }
  fragment.querySelector("[data-project-source]").href = sourceUrl.href;
  for (const placeholder of fragment.querySelectorAll("[data-shell-slot]")) {
    const name = placeholder.dataset.shellSlot;
    if (slots.has(name)) {
      placeholder.replaceWith(slots.get(name));
    } else if (name === "extra") {
      placeholder.remove();
    }
  }

  root.classList.add("project-page");
  root.replaceChildren(fragment);
  // The shared outer fieldset now keeps these original controls disabled until connection.
  controls.disabled = false;
  root.setAttribute("data-project-mounted", "");
})();
