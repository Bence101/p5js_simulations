# Chunk Structure

Chunk Structure demonstrates a uniform grid used to narrow proximity checks in a two-dimensional field. Randomly placed cells are indexed into grid buckets, moving probes and the mouse query nearby buckets, and the canvas highlights candidate and nearby cells.

## Running

Serve the repository over HTTP and open [index.html](./index.html). The page uses the shared [project shell](../../assets/js/project-shell.js), [stylesheet](../../assets/css/style.css), and [page controller](../../assets/js/project-page.js). It loads the project's local p5.js 1.4.0 and p5.sound files, followed by the original simulation scripts.

The sketch keeps its 800&times;600 logical canvas. The shared page scales the displayed canvas down to fit smaller screens without changing simulation coordinates.

## Controls and behavior

| Setting | Default | Behavior |
| --- | ---: | --- |
| Grid subdivisions | 8 per axis | Sets the uniform grid resolution; takes effect after Restart Simulation. |
| Static cells | 200 | Creates this many randomly positioned cells on restart. |
| Moving probes | 20 | Creates this many randomly positioned probes on restart. |
| Check moving-probe neighborhoods | On | Enables or disables moving-probe proximity checks immediately. Mouse checks remain active. |
| Show grid and population | On | Toggles the grid, cells, and moving probes immediately. The mouse search circle remains visible. |

Move the mouse over the canvas to follow nearby cells. Press **A** or **D** to decrease or increase the mouse search radius by 5 logical pixels; the shortcut is inactive while a form control has focus. There are no canvas click or drag actions.

**Restart Simulation** recreates the populations with the current settings, clears the cumulative candidate-check counter, and restores the mouse search radius to 15 px. **Reset Everything** restores the sketch defaults and restarts the simulation. The overlay shows cumulative candidate checks in thousands and the current frame rate.

## Original next step

The supplied source includes a planning note to refactor `constrainBorder()` so it no longer depends on the global canvas dimensions. The note is preserved at [supportFunctions.js, line 28](./supportFunctions.js#L28).
