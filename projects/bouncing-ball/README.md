# Bouncing Ball

A standalone p5.js simulation using the local p5.js files included in this project. Serve the repository over HTTP and open [index.html](./index.html). The page uses the shared [project shell](../../assets/js/project-shell.js), [stylesheet](../../assets/css/style.css), and [page controller](../../assets/js/project-page.js).

## Original behavior and defaults

The simulation keeps the supplied sketch's 400×400 canvas, gray `background(220)`, starting position `(0, 0)`, turquoise RGB color `(100, 200, 200)`, alpha `50`, 20 px ellipse, and signed `(10, 20)` pixel steps per frame at 60 fps. It draws before moving, retains every mark until the canvas is cleared, and reverses the direction signs using the original `x > 400`, `x < 0`, `y > 400`, and `y < 0` checks. While the mouse is pressed, drawing and movement pause; clicking clears the canvas.

The logical canvas dimensions and defaults are declared in [sketch.js](./sketch.js). The sketch passes its `createCanvas()` renderer and `DEFAULTS` object to `ProjectPage.connect()`, so the fixed canvas display size and native control defaults are applied by the shared page controller.

## Controls

| Setting | Sketch default | Behavior |
| --- | --- | --- |
| Ball color | `#64c8c8` | Updates the RGB color immediately; the original alpha of `50` is retained. |
| Speed multiplier | `1×` | Scales the original 10 px horizontal and 20 px vertical steps per frame. |
| Diameter | `20` px | Updates the ellipse diameter immediately. |
| Leave motion trail | On | Keeps the original persistent trail. Turning it off redraws the gray background every frame. |

**Restart Simulation** clears the canvas and returns the ball to its original position and direction while keeping current settings. **Reset Everything** restores the sketch defaults and restarts. There are no custom keyboard shortcuts.

## Project information

There are no project plans or disclaimers in the supplied files. The commented-out sketch fragment is not a planning note, so the Next Steps section is intentionally empty.
