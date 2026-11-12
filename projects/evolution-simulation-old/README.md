# Creature Obstacle-Avoidance Prototype

An early p5.js prototype for creatures navigating a bounded board with rectangular obstacles. Creatures start at random positions and velocities and use one forward ray for obstacle detection and avoidance; evolution, learning, and multi-ray vision are not implemented.

## Current behavior

- The sketch loads its initial dimensions and simulation settings from [`settings.json`](./settings.json). The logical canvas and board are both 600 × 600 pixels.
- Creatures receive random initial positions and velocities. They move around the board, react to nearby rectangular obstacles, and are constrained by automatically created border obstacles.
- The current eyesight implementation creates one forward ray. The field-of-view angle controls only the optional displayed arc; it does not affect obstacle perception.
- Left-dragged rectangular obstacles are temporary board edits. Placement is accepted only when the drag begins at the top-left and ends at the bottom-right.
- There is no population selection, crossover, NEAT, learning, or fitness system.

## Preserved keyboard and mouse controls

| Input | Behavior |
| --- | --- |
| Left / Right Arrow | Steer the first creature. |
| Up / Down Arrow | Increase or decrease the first creature's speed. |
| Q | Stop the first creature. |
| R | Restore the board view. |
| F | Fit the board in the view. |
| + / - | Increase or decrease simulation speed. The speed-down action clamps at zero. |
| Space | Pause or resume the p5 draw loop. |
| * | Add a 1,000-update fast-forward batch on the next draw. The ordinary update for that draw also runs. |
| S | Update the board JSON output. |
| Left-button drag | Add a rectangle, only from top-left toward bottom-right and with both ends on the canvas. |
| Left-button double-click | Remove the obstacle under the pointer. |
| Middle-button drag | Pan the board view. |
| Mouse wheel | Zoom the board view. |
| Any held mouse button | Make all creatures seek the pointer while the button is held, in addition to the mouse action above. |

Pausing stops creature movement. Board editing, panning, and zooming are also ignored while the draw loop is paused; resume the loop before using those interactions.

The S shortcut writes a valid JSON object to a labeled, read-only textarea with a live status message. It contains the board dimensions and non-border obstacles; select the text to copy it.

## Settings and controls

The shared page controller reads each named native input into the settings object. The initial values come from `settings.json`; the sketch passes them to `ProjectPage.connect()` as defaults, including converting JSON's numeric checkbox values to booleans.

| Control name | Input and constraint | Default | Settings mapping | Applies |
| --- | --- | ---: | --- | --- |
| `nCreatures` | Range, integer 1–20, step 1 | 1 | `simulation.nCreatures` | On restart only |
| `viewDistance` | Range 20–200 px, step 5 | 70 | `simulation.creatureProperties.eyesight.viewDistance` | Live; ray length and avoidance look-ahead |
| `fieldOfView` | Range 0–3.14 radians, step 0.05 | 1.1 | `simulation.creatureProperties.eyesight.fieldOfView` | Live; displayed arc only |
| `drawRays` | Checkbox | On | `simulation.creatureProperties.eyesight.drawRays` | Live |
| `drawFieldOfView` | Checkbox | Off | `simulation.creatureProperties.eyesight.drawFieldOfView` | Live |
| `showAvoidSegmentGuides` | Checkbox | Off | `debug.showAvoidSegmentGuides` | Live |
| `showObstacleDebugTriangles` | Checkbox | Off | `debug.showObstacleDebugTriangles` | Live |

The creature-count control is intentionally limited to 1–20. Zero is not offered, so the first-creature steering shortcuts remain available; the sketch also guards the steering handler if no creature exists. Sight distance is limited to 20–200 px, and the displayed half-angle to 0–3.14 radians. The configured wander-guide flag is not exposed because the current normal behavior does not call the wander method.

### Restart and reset behavior

- **Restart Simulation** creates new creatures at random positions and velocities using the current settings. It preserves user-created obstacles, the current view transform, simulation speed, pause state, and all control values.
- **Reset Everything** restores the sketch defaults, removes user-created obstacles, restores the initial view and simulation speed, clears any pending fast-forward, resumes the draw loop, and recreates the initial creature population.
- Calling the native `simulation-controls` form reset performs the same synchronization and restart as Reset Everything, including updating slider outputs.

## Dependencies and canvas sizing

The page uses the shared [`style.css`](../../assets/css/style.css), [`project-shell.js`](../../assets/js/project-shell.js), and [`project-page.js`](../../assets/js/project-page.js) through relative paths. It retains the existing p5.js 1.4.0 and p5.sound 1.4.0 CDN scripts and the classic global-mode project scripts; each dependency is loaded once, before the project code. `settings.json` is loaded from `./settings.json`, relative to the project page.

This is a fixed-size 600 × 600 simulation. `createCanvas()` uses the dimensions from `settings.json`; the returned renderer is parented to `#sketch` and passed to `ProjectPage.connect()`. Shared CSS scales the displayed canvas down on narrow screens without changing logical coordinates. The sketch does not call `resizeCanvas()` or install a resize observer. The old project `style.css` contained only generic body and canvas rules now supplied by the shared stylesheet, so it is no longer included.

## Next steps and known limitations

- Expand [`Eyesight`](./eyesight.js) from one ray to the planned 5–7 rays, then explore a genetic algorithm (population, selection, and crossover) and a compatible NEAT component. The proposed first experiment is to test creatures moving toward the board center. These are plans, not implemented simulation behavior; see [`__ToDO.txt`, lines 2–7](./__ToDO.txt#L2).
- Consider a mouse-mode toggle for board manipulation. Rectangle creation is restricted to top-left-to-bottom-right drags; the original notes say this directional restriction is handled, while still identifying problems with the avoidance triangles. Obstacle creation is inaccurate while zoomed. See [`__ToDO.txt`, lines 10–17](./__ToDO.txt#L10) and [`__ToDO.txt`, lines 26–27](./__ToDO.txt#L26).
- Explore rotating, moving, and circular obstacles, and investigate corner-side selection and jittery avoidance. The obstacle comment describes a corner case where using both current and projected creature positions may be needed; the mover comment questions how future-position information should be passed for narrow obstacles. See [`__ToDO.txt`, lines 30–34](./__ToDO.txt#L30), [`obstacle.js`, lines 82–87](./obstacle.js#L82), and [`mover.js`, lines 127–129](./mover.js#L127).
- As exploratory architecture work, consider the proposed `CreatureController` and whether existing spatial logic is related to spatial hashing; neither has been implemented or selected as a design. See [`__ToDO.txt`, lines 21–23](./__ToDO.txt#L21).
- Other project-authored comments suggest extracting creature behavior, refactoring `BoardManipulator` to reduce global dependencies, and revisiting the simulation-speed helper. These are code-organization ideas, not functionality; see [`creature.js`, lines 16–18](./creature.js#L16), [`board.js`, line 113](./board.js#L113), and [`utils.js`, line 10](./utils.js#L10).

## Validation performed

- Checked every local `src` and `href` in the project page; all referenced local files exist. The stale `food.js` reference was removed.
- Served the repository over local HTTP at both `/projects/evolution-simulation/index.html` and `/p5js_simulations/projects/evolution-simulation/index.html`. In the browser, verified shell initialization, p5.js 1.4.0 and p5.sound 1.4.0 loading, relative `settings.json` loading, the exact GitHub project URL, and the root-appropriate Back to Portfolio link. Successful loads had no unexpected console errors or failed network requests.
- Loaded and ran the changed project scripts in the browser, and separately parsed them with the browser's JavaScript engine.
- Tested live eyesight and debug settings, restart-only creature count, repeated restarts without control changes, persistence of a user-created obstacle across restart, board JSON export, and obstacle removal.
- Tested the keyboard controls, pointer seeking while a mouse button was held, left-drag obstacle creation, middle-drag panning, wheel zoom, and view restore/fit. The fast-forward check observed a 1,001-step increase: 1,000 additional updates plus the ordinary update in the same draw.
- Tested Reset Everything and direct native form reset, including default slider outputs, board edits, view, speed, and pause state. Forced an adapter connection failure and confirmed the error is visible while settings and action buttons remain disabled.
- Checked desktop and 375 px-wide mobile layouts: the logical canvas stayed 600 × 600, the displayed canvas scaled down without document horizontal overflow, scaled-canvas mouse input worked, the keyboard focus order was intact, and the sight-distance slider responded to ArrowRight.

There is no project build or automated test runner.
