"use strict";

const projectGrid = document.querySelector("#project-grid");
const viewSwitch = document.querySelector(".view-switch");
const projectCount = document.querySelector("[data-project-count]");

if (projectGrid && viewSwitch) {
  const layoutButtons = viewSwitch.querySelectorAll("button[data-layout]");

  viewSwitch.hidden = false;

  viewSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-layout]");

    if (!button || !viewSwitch.contains(button)) {
      return;
    }

    projectGrid.dataset.layout = button.dataset.layout;

    for (const layoutButton of layoutButtons) {
      layoutButton.setAttribute("aria-pressed", String(layoutButton === button));
    }
  });
}

if (projectGrid && projectCount) {
  projectCount.textContent = String(projectGrid.querySelectorAll(".project-card").length).padStart(2, "0");
}