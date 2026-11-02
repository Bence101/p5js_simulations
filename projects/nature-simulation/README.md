# Nature Simulator

Nature Simulator is an independent p5.js ecosystem simulation. Agents move around a 600 by 400 canvas, forage for grass when their health is low, reproduce after meeting the existing health, age, and cooldown checks, and lose health over time. Grass appears at a regular frame interval, and a Chart.js graph records agent and grass counts.

Open [index.html](./index.html) through a local HTTP server. The page uses the shared project shell, page controller, and stylesheet while keeping the simulation and chart in this directory.

## Dependencies and assets

The page retains the original versioned CDN dependencies: p5.js 1.2.0, p5.sound 1.2.0, and Chart.js 2.4.0. The supplied `p5.js` and `Chart.min.js` files are bundled copies of the first and third libraries. The bundled `p5.sound.min.js` reports version 0.3.12, so it is intentionally not loaded; the original page used p5.sound 1.2.0 from cdnjs.

## Controls and actions

| Control | Type and bounds | Default | Applies |
| --- | --- | --- | --- |
| Initial agents | Native range, 0-200, step 1 | 100 | On restart |
| Initial grass | Native range, 0-200, step 1 | 50 | On restart |
| Grass spawn interval | Native range, 1-120 frames, step 1 | 10 | Live |

Defaults are declared in `sketch.js` and passed to `ProjectPage.connect()`. Changing the initial population sliders stores the requested starting counts; it does not change the current population until restart. The grass interval updates while the simulation is running. The simulation runs at its original 60 frames per second, and the graph samples every 60 frames.

**Restart Simulation** clears the current population and chart, then creates new agents and grass using the current settings. It leaves all controls unchanged. **Reset Everything** restores the sketch defaults, synchronizes the slider outputs, clears the chart, and restarts. A native form reset has the same reset behavior.

There are no custom keyboard shortcuts or mouse controls on the simulation canvas. Native sliders support their standard keyboard behavior. Hovering over a plotted chart point displays the Chart.js tooltip; this mouse-only chart interaction has no keyboard equivalent.

## Preserved implementation notes

The original planning comments and their provenance are retained in the source files:

- Investigate the note about multiple agents retaining a reference to a grass patch after it is eaten or removed: [sketch.js, lines 1-2](./sketch.js#L1-L2).
- Explore evolving field of view and reproduction food thresholds, then speed, and observe the proposed generation-to-generation changes: [sketch.js, lines 4-7](./sketch.js#L4-L7).
- Separate health from hunger: [agent.js, lines 28-29](./agent.js#L28-L29).
- Complete the planned enemy-avoidance, mate-seeking, and food-search decision flow before falling back to random movement: [agent.js, lines 189-203](./agent.js#L189-L203).

These are future plans, not implemented simulation features.
