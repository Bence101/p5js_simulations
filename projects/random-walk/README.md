# Random Walk

A standalone p5.js simulation using the project's bundled p5.js 1.1.9 files. Serve the repository over HTTP and open [index.html](./index.html). The page uses the shared [project shell](../../assets/js/project-shell.js), [stylesheet](../../assets/css/style.css), and [page controller](../../assets/js/project-page.js).

## Original behavior

The sketch uses a fixed 400×400 canvas with a gray `background(220)`, a 10 px turquoise mark, and a starting point at `(100, 100)`. Each frame it moves by independently randomized horizontal and vertical steps between -5 and 5 pixels, reversing the corresponding direction sign when it crosses a canvas edge. Marks persist, and the sketch requests 120 frames per second, subject to browser and display limits.

The original page had no controls or keyboard shortcuts. Clicking the canvas clears the trail; while the mouse button is held, drawing and movement pause. There are no other canvas mouse actions.

## Controls

| Setting | Type and default | Behavior |
| --- | --- | --- |
| Trail color | Color picker, `#64c8c8` | Updates the mark color live. |
| Maximum step distance | Range, 0–10 px per axis; default 5, step 0.5 | Updates the random step range live. Each axis is sampled independently from the negative to positive selected maximum. |

**Restart Simulation** clears the canvas and returns the walker to `(100, 100)` with its original direction signs and initial step state, keeping both settings. **Reset Everything** restores the sketch defaults and restarts. Neither setting requires a restart.

Use Tab to reach the native controls; the slider supports arrow keys, the color picker uses its native controls, and the shared buttons support Enter or Space. The canvas actions have no keyboard equivalents.

## Project information

No project plans, next steps, or disclaimers were found in the supplied project files. The commented-out sketch lines are not planning notes, so the shared Next Steps area is intentionally empty.
