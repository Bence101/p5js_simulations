# Flocking

An existing boid simulation, adapted in place to the shared portfolio shell. Regular green boids combine separation, alignment, cohesion, attraction to a follow point, and obstacle avoidance. Larger red chasers pursue nearby regular boids; brown rocks remain stationary.

Open [index.html](./index.html) through a local HTTP server, or follow its portfolio card. No build step is required.

## How to Use

- Choose **Follow point**, then click inside the canvas to move the black target. Moving the pointer alone does not move it.
- Choose **Create boid**, **Create rock**, or **Create chaser**, then click inside the canvas to add one of that object at the clicked position. Rocks have a random drawn diameter of 10-30 logical pixels.
- Change any slider while the simulation runs. Use its **Reset** button to restore only that slider without clearing the simulation.
- Toggle **Show distances** to draw the original distance circles, or **Avoid walls** to add edge steering. Both start off.
- Use **Restart Simulation** to recreate the initial population with current settings, or **Reset Everything** to restore defaults and restart.
- There are **no custom keyboard shortcuts** and no keyboard equivalents for canvas actions. Native controls support Tab/Shift+Tab navigation, arrow keys for sliders and radio choices, Space for checkboxes, and Enter/Space for buttons.

Canvas actions run on press, only strictly inside its logical bounds; clicking elsewhere does not affect the simulation. There is no continuous drag action, hover-follow behavior, object removal tool, or separate custom touch gesture. The original p5 touch-to-mouse fallback uses the same selected action; its default event is suppressed on the canvas to avoid adding an object twice through compatibility mouse events.

## Preserved controls and defaults

All seven sliders apply **live to regular boids**, including boids added by clicking. None requires restart. The five steering weights are dimensionless; setting a weight to zero disables that contribution.

| Label / setting name | Range | Step | Default | Model mapping |
| --- | --- | --- | --- | --- |
| Separation / `separation` | 0-1 | 0.01 | 0.21 | `separationCoefficient`: steer away from neighbors |
| Alignment / `alignment` | 0-1 | 0.01 | 0.5 | `alignmentCoefficient`: align with neighboring velocities |
| Cohesion / `cohesion` | 0-1 | 0.01 | 0.2 | `cohesionCoefficient`: steer toward neighbors' center |
| Mouse follow / `mouseFollow` | 0-1 | 0.01 | 0.03 | `mouseCoefficient`: steer toward the clicked target |
| Obstacle avoidance / `obstacleAvoidance` | 0-1 | 0.01 | 0.2 | `obstacleAvoidanceCoefficient`: steer away from nearby rocks |
| Neighbor distance / `neighborDistance` | 0-100 px | 1 | 80 | `neighbourDistance`: neighbor detection radius and wall-avoidance zone |
| Speed / `speed` | 0-10 px/frame | 1 | 3 | `speed`: movement magnitude per animation frame |

Each slider has a labeled native input, a synchronized numeric output, and a keyboard-accessible individual Reset button. Individual reset restores the input's HTML `defaultValue`, emits an input event through the shared controller, and leaves all other settings, populations, obstacles, and the target unchanged. This replaces the old p5 Controller reset, which incorrectly overwrote its paragraph reference instead of updating the displayed value.

| Additional control | Default | Live behavior |
| --- | --- | --- |
| Show distances / `showDistances` | Unchecked | Sets regular boids' `showDistance`; draws a circle at each boid's tip. The original drawing uses neighbor distance as the circle **diameter**, while neighbor detection uses it as a radius. |
| Avoid walls / `avoidWalls` | Unchecked | Sets regular boids' `avoidWalls`; adds edge steering within neighbor distance. A smaller neighbor distance may look better. Wrapping at canvas edges still occurs. |
| On click action / `clickAction` | Follow point | Native radio group: Follow point, Create boid, Create rock, Create chaser. The selection takes effect on the next canvas press. |

Chasers retain their original independent coefficients, neighbor distance of 80, speed of 2.8 px/frame, size of 30, and pursuit behavior. They are not driven by the regular-boid sliders or checkboxes. The regular-boid count displayed at the top left excludes chasers.

## Start, restart, and reset

The simulation targets **60 FPS**, begins with **50 regular boids** at random positions and directions, **zero chasers**, **zero rocks**, and the follow target at **(400, 300)**. It retains the blue background and on-canvas boid count.

- **Restart Simulation:** discards all current objects, creates 50 new regular boids using current settings, clears added boids/chasers/rocks, and centers the target. Slider values, outputs, radio selection, and checkboxes remain unchanged. Random initial positions and directions are resampled; this is not a deterministic replay.
- **Reset Everything:** restores every native HTML default above, synchronizes outputs and live settings, then performs the same restart.
- Direct `document.getElementById("simulation-controls").reset()` has the same full-reset behavior. The shared controller waits until native defaults have been restored before applying them.
- Repeated restarts do not recreate the canvas, reconnect the adapter, or register additional listeners.

The shared [shell](../../assets/js/project-shell.js) mounts the page slots; the [controller](../../assets/js/project-page.js) reads typed settings and manages outputs and full resets. The sketch calls `ProjectPage.connect({ canvas, applySettings, restart })` once from p5 setup, after creating the canvas and wiring individual resets. Controls stay disabled until canvas validation, initial application, and restart succeed. A missing shell or failed initialization does not enable nonfunctional controls.

## Canvas sizing and dependencies

The logical canvas defaults to **800 x 600 (4:3)**, defined only by `createCanvas(800, 600)` in [sketch.js](./sketch.js). The p5 renderer is parented to `#sketch` and passed to `ProjectPage.connect()`, which derives the host's maximum width and aspect ratio from its logical dimensions, independently of pixel density. To change the size or ratio, edit only the `createCanvas()` arguments; there are no separate HTML sizing values to maintain. Shared CSS displays the canvas at its natural logical size when space permits, or uniformly scales it down to fit the sidebar or stacked narrow-screen layout; it never enlarges a smaller canvas. There is no `resizeCanvas`, viewport-dependent simulation resizing, or change to logical coordinates. p5 1.1.9 maps scaled pointer coordinates back to the logical canvas.

Deferred loading order is the shared shell, shared controller, bundled [p5.js](./p5.js) **1.1.9**, then [sketch.js](./sketch.js). The original CDN also loaded 1.1.9; the bundled file has the same version and avoids a network dependency. The sketch uses p5 drawing, vector, random, timing, and pointer APIs, but **no sound API**, so the unused p5.sound script and bundled add-on were removed. There are no additional dependencies, upgrades, or p5-created DOM controls.

The original boid, chaser, and obstacle implementations and flocking rules remain in place. The integration replaces the HUD/control reads, adds state restart, and restricts press handling to the canvas. It does not redesign the simulation or implement the source's cleanup note.

## Verification

Checked locally in Chromium at both `/projects/flocking/index.html` and `/p5js_simulations/projects/flocking/index.html`:

- Browser parsing of the changed classic JavaScript, local HTML asset/navigation paths and filename case, and whitespace checks passed. No tooling or dependencies were installed.
- Normal loads had no console errors, failed requests, or HTTP error responses. The bundled p5.js header identifies version 1.1.9, with no sound add-on requested.
- All seven sliders passed live minimum/maximum/changed-value checks, individual resets, and output synchronization. Both checkboxes passed repeated toggles; distance-circle drawing, wall steering, and speed zero were also checked.
- All four canvas actions and outside-click rejection passed at **1440, 1024, 801, 800, 390, and 320 px** viewport widths. Emulated touch at 390 px performed one action per touch, without compatibility-event duplicates.
- Five consecutive restarts retained changed controls, restored the population/target, cleared additions, and kept the same single canvas. Reset Everything and direct native form reset restored every default and output.
- Resizing preserved simulation coordinates and state, retained the logical 800 x 600 size and displayed 4:3 ratio, and caused no horizontal document overflow. The portfolio's grid and list layouts also had no overflow at all six widths.
- Native keyboard focus, slider/radio arrow keys, checkbox Space, individual-reset Space, and restart Enter passed. Missing scripts, an intentionally failing adapter, and JavaScript disabled left controls disabled; static fallback and no-script content remained available.
- Back to Portfolio and the exact GitHub source-directory href were checked at both URL mounts. The fifth card's destination and 05 count passed, and its lazy-loaded preview decoded at the declared **800 x 600** dimensions. The preview was exported directly from the running canvas, not reconstructed.

These are browser/emulation checks, not physical-device or cross-browser guarantees. The integrated browser did not expose a new-tab event for the card: its original `_blank`/`noopener` conventions were verified, and its destination was followed in the same tab for navigation testing.

## Project Information

### Background and References

Content intentionally left empty for a future update.

### Next Steps

**Unimplemented source note:** "The code should be tidied." This translates the original Hungarian comment at [sketch.js, lines 1-4](./sketch.js#L1-L4). It is an unimplemented source note, not authorization for a broad cleanup and not work completed by this integration. No separate project planning file exists.
