# Self-Driving Car

An existing p5.js neuroevolution simulation, integrated **in place** into the portfolio's shared project-page shell. Cars follow ordered checkpoints on the original PNG track. Fitness-weighted selection, uniform mutation, and unchanged best-brain inheritance drive evolution; there is no crossover or NEAT.

Open [index.html](./index.html) through local HTTP. The project also works beneath the repository URL prefix, for example `/p5js_simulations/projects/self-driving-car/index.html`. There is no build step, backend, or package installation.

## Opening in Edge or another browser

1. Serve the repository with VS Code Live Server or another local HTTP server.
2. Copy the server's full `http://localhost:.../projects/self-driving-car/index.html` or `http://127.0.0.1:...` address into Edge. Use the port and path supplied by your server; a repository prefix may also be present.
3. Keep the server running while using the page. A deployed GitHub Pages HTTPS address also works.

Do not double-click the HTML file or open its filesystem path in Edge. That produces a `file:///...` URL with a null origin; p5.js 1.4.0 loads images using `fetch()`, which Edge blocks for local files. The page now detects this unsupported opening method, leaves controls disabled, and displays HTTP-server instructions instead of attempting the blocked PNG fetches. Browser security settings do not need to be weakened.

## Original baseline and integration boundaries

Before integration, the page had source-configured settings, a p5-created debug paragraph, global manual driving keys, and an unfinished Track Builder overlay. It referenced p5.js **1.4.0** and p5.sound on a CDN plus a missing `checkpointList.js`; the checkpoint array was already present in [init.js](./init.js). The bundled [p5.js](./p5.js) header also identifies version 1.4.0. This page now loads that unchanged local version, without the unused sound add-on or stale checkpoint script.

The original assets, checkpoint coordinates, sensing, movement, collision checks, fitness calculation, weighted selection, mutation, and network construction are preserved. Track Builder is excluded from runtime, not merged into the driving model. Image Creator remains an independent, unchanged authoring tool.

One narrow learning-lifecycle blocker was fixed in [population.js](./population.js): previously a generation with all fitness values equal to zero never selected a best brain. Its successor lost the elite slot (and a one-car population became empty), with an undefined maximum score. The first car now supplies the initial best-brain candidate even at zero fitness; strictly better fitness still replaces it. Weighted mating and the random fallback for a zero-fitness mating pool are otherwise unchanged.

## Controls and model mapping

These are requested integration ranges, **not original slider ranges**. Defaults live in [init.js](./init.js), keyed by control `name`, and are passed to `ProjectPage.connect()` as `defaults`. The shared controller establishes both current values and native form-reset defaults.

| Setting / control name | Native type | Range | Step | Default | Model mapping and application timing |
| --- | --- | --- | --- | --- | --- |
| Simulation speed / `simSpeed` | Range | 1-10 | 1 | 1 | Live: simulation updates per rendered frame. Not guaranteed wall-clock acceleration. |
| Mutation amplitude / `mutationRate` | Range | 0-1 | 0.01 | 0.2 | Live for **subsequent offspring generation**: [Utils.mutationFunction](./utils.js) adds a uniform random shift in `[-amplitude, +amplitude)` to every weight and bias. Not a per-weight mutation probability. Existing brains and the elite remain unchanged. |
| Population size / `popSize` | Required number | 1-100 | 1, whole numbers only | 10 | **Restart/reset only**. Pending edits do not change the active run's population size, including at a generation transition. |
| Show ancestor labels / `showParentText` | Checkbox | Off/on | Not applicable | On | Live: offspring show parent indices; the unchanged elite has a `best` label. Initial cars have no ancestors to label. |

Slider outputs are maintained by the shared controller. Empty, fractional, non-finite, or out-of-range population values receive a visible error, native validity feedback, and `aria-invalid`. They are not clamped, replaced with defaults, or sent to a population constructor. While invalid, form synchronization and restart are blocked; correct the field or use Reset Everything. Valid live edits never recreate the current population.

At amplitude zero, selection continues but mutation adds no perturbation. Raising speed increases work per frame; the original pixel-sampling implementation is computationally expensive, particularly above **10 cars**. The allowed maximum is not a performance recommendation.

## Continuing, restarting, and resetting

- **Continue evolution:** leave the page running. Each generation's offspring are selected by fitness and mutated using the currently applied amplitude, and the best brain is copied unchanged. Live speed/label edits retain learned state.
- **Restart Simulation:** discard learned population state and create a fresh random initial population using current controls, including pending population size. Reset generation to 0, generation age to 0, and terminal-run state. Keep every control value and resume animation if it was stopped.
- **Reset Everything:** use the shared native form-reset lifecycle to restore all four code-provided defaults, synchronize outputs/settings, and restart fresh learning.
- **Direct `form.reset()`:** has the same full-reset behavior, including clearing numeric errors. It is not a separate user-facing action.

Generation and age are project-owned HTML readouts, without frame-by-frame live-region announcements. Generation numbering starts at **0**. A generation ends when there is no alive, unfinished car or when its age reaches **3000 updates**. The existing no-progress check kills cars without a checkpoint after the population age exceeds 200. At **1000** completed generation transitions, animation stops and a visible message explains how to restart. Restart does not reload, reconnect the adapter, recreate the canvas, or install more listeners.

## Complete active input inventory

1. **Focus the simulation:** Tab to its named canvas workspace, or click/tap the canvas. Its focus outline is visible. Tab/Shift+Tab leaves it normally.
2. **Left/right arrows:** add steering inputs to applicable cars.
3. **Up/down arrows:** add acceleration/deceleration inputs to applicable cars.
4. **Space:** performs the existing zero-speed assignment.
5. **Native controls:** Tab navigation, slider/number arrow keys, checkbox Space, and button Enter/Space retain ordinary native behavior. Driving does not run while a native control or another page element has focus.
6. **Restart Simulation / Reset Everything:** the distinct actions described above.

Manual driving is **alongside**, not instead of, neural-network control. [Car.update()](./car.js) checks collisions, senses walls, checks checkpoints, applies manual input, then runs the AI and movement. Inputs affect applicable cars, not a separately selected player car. The AI can change steering/speed afterward in the same update. In particular, Space is **not a reliable pause**, and does not disable AI. Arrow/Space scrolling is prevented only in the deliberate simulation focus context.

There are **no canvas editing or mouse-based simulation actions**. Clicking/tapping only focuses the workspace; dragging does not create, move, or delete objects or track geometry. There are no active editor shortcuts, modes, node overlays, import/export actions, track selector, or image upload. No generation-skipping button is provided.

## Preserved source configuration and learning interpretation

The following remain source-configured in [init.js](./init.js), [brain.js](./brain.js), and [car.js](./car.js):

| Parameter | Preserved value |
| --- | --- |
| Logical canvas | 800 x 600 |
| Initial population / mutation amplitude / updates per frame | 10 / 0.2 / 1 |
| Ancestor labels / generation skipping | Enabled / 0 |
| Start position / heading | `(470, 100)` / `0` radians |
| Generation limit / maximum generation age | 1000 / 3000 updates |
| Fitness speed-correction endpoints | 0.5 and 2 |
| Car dimensions / tightened collider | 40 x 20 / original `-5` adjustment |
| Minimum / maximum speed | 0.8 / 3 |
| Steering / speed-change increments | 0.04 / 0.2 |
| Radar angles / length | `0, PI/4, PI/2, PI, -PI/2, -PI/4` / 80 |
| Ordered checkpoint list | Original 16 segments in [init.js](./init.js), unchanged |

**Network API discrepancy:** the original [Brain](./brain.js) calls `new NeuralNetwork(6, 4, 3, 4)`, but the bundled [library constructor](./libraries/nn.js) accepts only `(in_nodes, hid_nodes, out_nodes)`. Its actual network is **6 inputs -> 4 hidden nodes -> 3 outputs**, with sigmoid activation; the fourth constructor argument is ignored. This is not a four-layer or four-output network. The six inputs are unnormalized radar distances (80 when no wall is detected). The largest output selects index 0 = left, 1 = right, or 2 = acceleration. The existing index-3 deceleration branch is unreachable with this network; manual down-arrow deceleration still works. Construction and library interpretation are deliberately unchanged, rather than silently redesigning the model to match an assumed architecture.

Fitness remains `(checkpoint score + partial progress)^2` multiplied by average-speed correction from 0.5 to 2. Mating uses cumulative fitness weighting, with the original random fallback when no threshold is crossed. Offspring receive uniform perturbations to all weights **and biases**; the best brain bypasses mutation and is copied into the next generation. The network library's training API is not used.

Generation skipping remains a source-only setting at 0. Its retained loop can monopolize the draw callback when enabled. No blocking skip action was added, and no particular learning outcome or generation count is promised.

## PNG track and authoring workflow

[track_1.png](./track_1.png) is an unchanged **800 x 600** PNG, both the displayed map and the source of collision data. Its transparent `[0, 0, 0, 0]` pixels are drivable; opaque `[0, 90, 102, 255]` pixels are walls. [Track](./track.js) samples that bitmap; [colliders.js](./colliders.js) retains pixel-by-pixel ray and polygon-edge sampling. No line-geometry replacement, recoloring, resampling, or viewport-based coordinate changes were introduced. Yellow lines are the original active checkpoints; blue circles are the original car collision markers, not editor nodes. The unchanged [redcar.png](./redcar.png) sprite is 512 x 256 and is drawn at the configured car dimensions.

The independent [Image Creator](../image-creator/index.html) can paint transparent roadway pixels against the matching wall color and export a bitmap through its own `saveImage()` workflow ([authoring source](../image-creator/imageCreator.js), [authoring shortcuts](../image-creator/sketch.js)). To author a different source map, export a compatible PNG and deliberately update this project's bundled asset/preload path. Configure start position, heading, and **ordered** checkpoints separately in [init.js](./init.js); those are not encoded in the PNG. This is a developer workflow, not a feature of the running driving page.

There is **no live connection** to Image Creator, no loading of its scripts, no shared runtime state, and no runtime map-editing or import feature here.

### Excluded Track Builder prototype

The original [trackBuilder.js](./trackBuilder.js) is retained **unchanged**, but is not loaded, instantiated, updated, rendered, or forwarded mouse/keyboard events. Its prototype stores **two boundary-node lists and a third list of paired checkpoint endpoints**, can export those lists as JSON, and has an incomplete import method referring to undefined local variables. Its drawn geometry is not connected to the active bitmap collision track.

Exclusion is a deliberate integration decision, not a completed geometric-track implementation or a statement that the idea was abandoned. No editor controls, node overlays, mode indicators, import/export actions, or editor shortcuts are exposed by this page. No editor reset state is required.

## Page, sizing, and dependencies

The current [shared shell](../../assets/js/project-shell.js), [controller](../../assets/js/project-page.js), and [stylesheet](../../assets/css/style.css) provide the sidebar layout. A demonstrated shared naming defect was corrected: the Background and References heading now uses `project-background` instead of `background`, avoiding a named-window-property collision with p5's global `background()` function. The `background` content slot and visible heading are unchanged; the controller and stylesheet were not modified. All scripts are deferred: shell, controller, unchanged local p5.js 1.4.0, unchanged matrix/neural-network libraries, then dependency-ordered simulation scripts. Sound APIs are unused, so the sound reference and unused bundled add-on were removed. The redundant missing checkpoint-script reference was removed without inventing a replacement.

The renderer returned by `createCanvas(800, 600)` is parented to `#sketch` and passed once as `canvas` to `ProjectPage.connect({ canvas, defaults, applySettings, restart })`. The controller derives fixed display dimensions and aspect ratio from it. Shared CSS scales the display uniformly down at 4:3 without changing logical coordinates, car positions, image data, or checkpoint coordinates. There is no resize handler or canvas recreation.

p5's `preload()` still loads both exact-case PNG paths before setup over HTTP/HTTPS, using valid success and failure callbacks for p5.js 1.4.0. Controls and shared actions remain disabled until initialization, initial settings, and restart succeed. A failed image load is visibly reported and logged. Without JavaScript/the shared shell, static content, the return-link warning, disabled native controls, and a no-script explanation remain available.

The matrix/NN source is the bundled Toy Neural Network code attributed by the [original notes](./__readme.txt) to [Coding Train's Toy Neural Network library](https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/lib). Its APIs and behavior are not replaced with another project's library.

## Original plans and provenance

Both original text notes remain unchanged: [__readme.txt](./__readme.txt) and [__todo.txt](./__todo.txt). Their learning-time observation is anecdotal, not a guarantee. The page leaves Background and References visibly empty; its Next Steps translates these actual remaining plans:

- **Task list, lines 2-6:** cleanup/organization after experiments, a smaller purpose-built NN class, NN visualization, fitness/finish-rate charts, and moving globals into a settings class or JSON. [brain.js](./brain.js), line 3, is also a future visualization placeholder. None is implemented here.
- **Task list, line 7:** UI is now partially complete via the four native controls. Other constants remain source-configured; charts, model views, and skip actions were not added.
- **Task list, lines 8-9:** proposed line-based collision geometry for performance and wheel-based rather than center-based steering rotation. These remain proposals; this integration deliberately preserves the PNG collision model and original physics.
- **Utility comments:** [utils.js](./utils.js), line 4, raises denominator-zero/parallel-segment handling; its mutation comment raises configuration placement. These unresolved concerns are documented, not silently redesigned.
- **Track Builder:** its boundary/checkpoint prototype and incomplete import remain in [trackBuilder.js](./trackBuilder.js), excluded from the runtime as described above. Existing paired-deletion behavior is not a new unfinished task.
- The old lifecycle's planned restart handling is fulfilled here. Ordinary explanatory comments, already-guarded checkpoint completion, commented-out rendering experiments, and third-party TODOs are not new project plans.

## Verification and limitations

There is no automated test framework or build in this repository. Integration validation used Chromium over local HTTP at both root and repository-prefixed URLs, browser syntax checks of every changed JavaScript file, and exact-case local asset checks. Normal loads had no console errors or failed network responses; Chromium's pixel-readback performance advisory is a retained limitation, not a load failure.

A follow-up startup check used the installed Microsoft Edge 156.0.4314.50 in headless mode with normal browser security. The HTTP page reached "Simulation ready.", enabled its controls, and advanced generation age; a filesystem URL displayed the explicit HTTP instructions and kept controls disabled. The `background` global-name and invalid image-callback warnings were also resolved. Shared-heading regression checks passed on the unconnected template, Bouncing Ball, and Particle Life without editing those simulations.

Checks passed for all four live/restart-only setting mappings, outputs, invalid population values, population bounds 1 and 100, continuing evolution, the exact 3000-update threshold, weighted selection thresholds, mutation amplitude/zero mutation, unchanged elite copies, repeated restart, full/native reset, and restart after a temporarily reduced runtime generation limit. The production limit remains 1000. Focus-scoped driving/manual-before-AI order, native keyboard operation, canvas pointer inactivity, and one canvas/adapter across repeated restarts/resets were checked.

At **1440, 1024, 800, 390, and 320 px**, the project retained 800 x 600 logical coordinates, uniform 4:3 downscaling, and no document overflow. Both portfolio grid/list layouts, labels/focus, navigation, and the sixth card's preview were checked. The [preview](../../assets/images/self-driving-car.png) is an actual PNG export of the default running canvas, captured at 1600 x 1200 backing-pixel resolution; markup matches those image dimensions.

Intentionally blocked adapter, neural-network, controller, shell, and track-image requests were tested **separately** from normal loading. They left controls disabled with the appropriate initialization/fallback warning. JavaScript-disabled checks preserved the static return link, no-script explanation, disabled controls, six-card listing, preview, and fallback count of 06.

Retained limitations include expensive pixel readbacks, background-tab throttling/suspension, center-based steering, source-only map/checkpoint configuration, the three-output network interpretation, unfinished prototype import, and the unimplemented plans above. Browser-emulated mobile/touch checks are not a physical-device or cross-browser guarantee.
