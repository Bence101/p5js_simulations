# Smart Spaceship

Smart Spaceship is a standalone p5.js genetic-algorithm simulation. A population of colored triangular ships starts near the bottom of a 600×600 canvas and evolves movement genes over generations while trying to reach the green target above a gray obstacle course. Fitness-weighted selection, crossover, mutation, and inherited colors make successful lineages easier to follow.

Open [index.html](./index.html) through a local HTTP server. The page uses the shared [project shell](../../assets/js/project-shell.js), [stylesheet](../../assets/css/style.css), and [page controller](../../assets/js/project-page.js); its p5.js and Chart.js dependencies remain local to this project.

## Original simulation and defaults

The logical canvas remains 600×600 pixels with the original light-gray background, colored triangular ships, green target, and advanced obstacle course. Each new population starts with 100 ships, runs for the level's recommended 500 updates, and evolves 200 generations. Movement genes are randomized and mutated at a rate of 0.002; the original fitness and color-tracing options remain unchanged.

Canvas dimensions and the native control default are declared in [sketch.js](./sketch.js). The sketch passes the renderer returned by `createCanvas()` and its `DEFAULTS` object to `ProjectPage.connect()`. The shared controller scales the fixed canvas uniformly on narrow screens without changing its logical coordinates.

On desktop, the controls sit to the right of the simulation and its performance chart appears directly below the canvas. The workspace stacks at narrower widths.

## Controls and interactions

| Control or action | Default / range | Behavior |
| --- | --- | --- |
| Simulation speed | `1`, from `0` to `20` updates per frame | Applies immediately. `0` pauses population progress; higher values process more updates per rendered frame. |
| Reset speed | Sketch default (`1`) | Restores only the speed setting; it does not restart the simulation. |
| Skip to Next Generation | Action | Fast-forwards the remaining updates in the current generation until the next generation starts. |
| Restart Simulation | Action | Starts a new generation-0 population, clears the performance chart, and restores the original obstacle course while keeping the current speed. |
| Reset Everything | Sketch default (`1`) | Restores the native control default and restarts the simulation. |
| Canvas click | Two clicks | Adds a rectangular obstacle between the two clicked points when both sides are at least 5 pixels long. |
| Canvas double-click | Double-click an obstacle | Removes the obstacle under the pointer. |

There are no custom keyboard shortcuts. Native controls use normal keyboard focus, slider keys, and button activation. The chart adds death, unfinished, and finisher rates after each completed generation.

## Project information

The original source includes planning notes and a gene-list constraint. They are reproduced in the page's **Next Steps** section with source links: [sketch.js planning comments](./sketch.js#L11-L32), [DNA inheritance note](./dna.js#L2-L5), [level-builder notes](./levelBuilder.js#L1-L4), and the [movement-gene lifetime constraint](./spaceship.js#L35).

The project keeps the bundled p5.js 1.1.9, p5.sound 0.3.12, and Chart.js 2.4.0 files. The original sound library remains included for dependency continuity; the simulation does not currently use audio.
