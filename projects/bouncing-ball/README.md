# Bouncing Ball

An independent p5.js 1.11.11 simulation, loaded from its existing jsDelivr CDN URL. Open [index.html](./index.html) through a local static HTTP server. The page uses the shared [project stylesheet](../../assets/css/style.css) and [page controller](../../assets/js/project-page.js); physics, mouse interactions, the adapter, and canvas sizing remain in [sketch.js](./sketch.js).

## Controls

| Setting | HTML default | Application |
| --- | --- | --- |
| Ball color | `#e8664a` | Updates every ball immediately |
| Number of balls | `1`, range `1` to `10` | Used on the next restart |
| Ball diameter | `36` px, range `12` to `72` | Updates every ball immediately and constrains positions |
| Ball collisions | Off | Toggles ball-to-ball collisions immediately |

The adapter receives `{ color: string, count: number, diameter: number, collisions: boolean }`. `applySettings` updates live state; `restart` creates the selected number of balls using those settings. Restart retains every control value. Reset Everything restores the native HTML defaults, synchronizes outputs and settings, then restarts without a page reload. See the [template contract](../_template/README.md#control-to-simulation-contract).

Click an empty canvas spot to add a ball (up to 10); click a ball to remove it. Overlapping balls are removed topmost first. These actions do not alter the count slider. There are no custom simulation keyboard shortcuts or canvas keyboard controls; native controls support normal keyboard navigation and activation.

## Canvas and behavior

This project explicitly uses **responsive 16:10** sizing. A project-owned `ResizeObserver` sizes the logical canvas from its host, rounding to whole pixels, without recreating the balls. Shared CSS keeps the displayed ratio exactly 16:10 despite logical pixel rounding. Every ball is constrained after resizing and diameter changes; the drawn diameter is capped by the canvas dimensions if necessary. The first ball retains its original initial position and velocity; additional balls, motion timing, optional collisions, and mouse interactions retain their existing behavior.

Background and References and Next Steps are intentionally empty on the page. The original Bouncing Ball files contained no planning notes or disclaimers to extract; no history, references, or plans have been invented.

## Verification

Check live color/diameter changes, collisions, click add/remove and the 10-ball limit, restart with a changed count, full reset (including outputs and the checkbox), host resizing with all balls in bounds, 16:10 display, desktop/mobile overflow, keyboard focus, and both navigation links. CDN availability is required. There is no build or test framework; use syntax checks and browser verification.

[Project source on GitHub](https://github.com/Bence101/p5js_simulations/tree/main/projects/bouncing-ball)
