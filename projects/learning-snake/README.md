# Learning Snake

An independent p5.js 1.4.1 simulation in which 300 neural-network agents learn to play Snake on 8&times;8 boards through a genetic algorithm. Open [index.html](./index.html) through a local static HTTP server. The page uses the shared [page shell](../../assets/js/project-shell.js), [project stylesheet](../../assets/css/style.css), and [page controller](../../assets/js/project-page.js). The simulation, chart, and adapter remain in this folder.

## Simulation

- **Population:** 300 agents (`POPSIZE` in [sketch.js](./sketch.js)). Each agent plays its own 8&times;8 Snake game. A generation ends when every agent has died or won.
- **Agent brain:** a 24-16-16-3 neural network ([neuralNetwork.js](./neuralNetwork.js)). Its inputs are wall, tail, and apple distances in eight directions (four straight and four diagonal) relative to the snake's heading. Its three outputs are turn left, go forward, and turn right ([snakeGame.js](./snakeGame.js)).
- **Evolution:** after each generation, parents are chosen by fitness-weighted roulette selection, their networks are recombined with single-point crossover, and Gaussian mutation is applied (5% rate, 0.1 standard deviation, clamped to &plusmn;1) ([population.js](./population.js), [utils.js](./utils.js)). The next generation consists only of new offspring.
- **Visualization:** the 700&times;700 canvas shows 49 agents on 8&times;8 boards in a 7&times;7 grid. The 49 are sampled at random with replacement, so one agent can appear more than once. The sample is fixed until the simulation restarts.
- **Statistics chart:** [lineChart.js](./lineChart.js) adds one point per finished generation. The left axis shows the best score (MaxScore) and average score (AvgScore), measured in apples eaten. The right axis shows average fitness (AvgFitness). A text summary of the latest generation appears below the chart.

## Dependencies

The page loads local copies of p5.js 1.4.1 ([p5.js](./p5.js)), mathjs 10.6.1 ([math.js](./math.js)), and Chart.js 2.4.0 ([Chart.min.js](./Chart.min.js)). Their versions match the original CDN URLs and were checked against the file headers. Nothing was upgraded and no dependency was added. No build step or backend is needed.

Scripts load with `defer` in this order: shared shell, shared controller, p5.js, mathjs, Chart.js, then `snakeGame.js`, `utils.js`, `neuralNetwork.js`, `population.js`, `lineChart.js`, and `sketch.js`. `lineChart.js` must run before the sketch because it creates `scoreChart`.

Two files are kept in the folder but are not loaded:

- [p5.sound.min.js](./p5.sound.min.js): the simulation uses no p5.sound features.
- [test.js](./test.js): it is mostly commented-out experiments, but its last lines are uncommented and reference a neural network (`testNN`) that is never created, so they would throw an error on load. It is a standalone diagnostic and is not part of the production page.

## Controls

| Control | HTML default | Application |
| --- | --- | --- |
| Animation frames per simulation step | `1`, range `1` to `30`, step `1` | Applies immediately |

The speed setting is the existing `stepRate` variable. The population advances one step (and generations are evaluated) only on animation frames divisible by this value. At 1, every agent moves once per animation frame, as in the original. Larger values slow the simulation and do not change the learning algorithm. No algorithm settings (mutation rate, population size, network shape) were added to the page.

The adapter receives `{ stepRate: number }`. `applySettings` updates `stepRate`. `restart` also uses the supplied value and:

- creates a new random population of 300 agents and starts over at generation 0,
- clears the statistics array, frame counter, chart data, and text readout,
- chooses a new random sample of 49 agents to display.

**Restart Simulation** leaves the speed control unchanged. **Reset Everything** restores the speed to 1 and then restarts. A direct `form.reset()` call behaves the same way. Neither action reloads the page. If initialization fails (for example, a missing script), the controls stay disabled.

## Interactions

There are no mouse or touch interactions on the canvas. The original `keyPressed` handler was kept as developer testing keys and verified in the browser:

- <kbd>Enter</kbd> calls `population.update()`, advancing every agent in the current generation by one extra step.
- <kbd>Left</kbd>, <kbd>Up</kbd>, and <kbd>Right</kbd> each call `update()` on the first agent. The direction value in the original code is ignored, so these keys do not steer the snake: the agent's neural network chooses the move. <kbd>Down</kbd> does nothing.

The shortcuts now ignore key events whose target is an input, select, textarea, button, or link. Without this, using the speed slider's arrow keys or pressing Enter on a button would also step the simulation. The handler does not call `preventDefault`, so arrow keys can still scroll the page.

## Canvas and layout

The page uses the shared **stacked** layout and **fixed** sizing. The logical canvas stays 700&times;700 (`data-sizing="fixed"`, `--canvas-logical-width: 700px`, aspect ratio `1 / 1`), is parented to `#sketch`, and is never resized. Shared CSS scales the displayed canvas uniformly on narrow screens. The page keeps the simulation coordinates and has no resize handler.

The chart lives in the shell's project-owned `extra` slot, so it appears below Project Information. It sits on a light panel because Chart.js 2.4.0 draws dark text and gridlines. The chart is responsive within a container whose height is clamped between 260 and 360 px, so it fits narrow screens without horizontal page scrolling. `maintainAspectRatio` is set to `false` for this.

## Project notes

Next Steps on the page lists the genuine plans and disclaimers from the Hungarian comments in the sources and in [ToDo.txt](./ToDo.txt), translated to English with line references. Several notes were deliberately **not** presented as future work, because the code shows they are done or they are only history:

- The first line of [sketch.js](./sketch.js) ("put crossover in after all") is stale: crossover is already used when creating each generation.
- Items marked with a check mark in the source notes (the apple-vision rework, the random start, the larger-network trial, the early-death investigation, and similar) and the project's progress notes are history.
- Commented-out code, debug printing, and "deletable" markers are ordinary development leftovers.

## Verified limitations

- The statistics array and chart grow by one entry per generation, with no cap and no pause control.
- The simulation is CPU-heavy (300 agents in mathjs plus 49 drawn boards). The frame rate depends on the device; it measured about 7 frames per second in the local test browser.
- With p5.js 1.4.1 and the shared shell's `id="background"` heading, p5's friendly-error code logs two informational console messages about a "reserved function" named `background`. They are logs, not errors, and `background()` works. They come from the combination of the preserved p5.js version and the shared shell, which was not modified.
- The local p5.js file is the unminified 1.4.1 build (about 4 MB).
- Verification was done in Chromium (embedded browser) at 1440, 1024, 390, and 320 px widths under a `/p5js_simulations/` URL prefix. No other browsers or physical devices were tested.

[Project source on GitHub](https://github.com/Bence101/p5js_simulations/tree/main/projects/learning-snake)
