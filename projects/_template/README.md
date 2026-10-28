# Project-page template

Copy this folder when integrating an **already-built, independent simulation**. It is a page shell, not a simulation framework. The sample controls are deliberately disabled, no p5.js dependency is loaded, and the source URL contains the explicit `PROJECT-SLUG` placeholder. Do not publish the copied page in that state.

## Integration checklist

1. Read the root [agent guidance](../../agents.md) and inspect the supplied simulation, dependencies, assets, controls, interactions, and planning notes. Preserve its behavior and dependency versions; do not migrate other projects.
2. Copy this folder to `projects/<project-slug>/`, using a short lowercase, ASCII, hyphenated slug. Bring in the existing simulation files and assets without losing features. Keep the shared stylesheet and page controller paths in [index.html](./index.html).
3. Replace the title, metadata, accessible canvas description, two- or three-sentence summary, sample controls, and How to Use list with accurate English text. Replace **every** `PROJECT-SLUG` occurrence with the actual directory slug. Remove the canvas placeholder and load the simulation's existing dependencies before its own scripts, in dependency order.
4. Choose one explicit canvas sizing mode below. Keep p5.js setup, resizing, and simulation state inside the project, not the shared controller.
5. Connect a real adapter after the simulation is ready. Leave the fieldset and both buttons disabled in HTML: the controller enables them only after initial settings and restart succeed. Never connect empty callbacks to make a page look functional.
6. Leave Background and References empty until content is requested. Inspect original source comments and project notes for actual plans, next steps, and disclaimers; surface those in Next Steps in English with relative links to their source files (and line references where useful). Do not extract ordinary comments, commented-out code, or third-party library TODOs. Do not invent history or plans.
7. Verify the checks below. Update the portfolio listing, preview image, and relevant documentation **only when the task calls for adding a project**. Do not list `_template` as a portfolio project.

## Control-to-simulation contract

[project-page.js](../../assets/js/project-page.js) exposes one method:

```js
// Call once, from setup() or the supplied simulation's equivalent ready callback.
ProjectPage.connect({
  applySettings(settings) {
    // Apply real live settings to the existing simulation here.
    // Defer only settings that genuinely require a restart.
  },
  restart(settings) {
    // Reset/recreate this simulation using the complete current settings.
    // Do not change form controls, reload the page, or register listeners again.
  },
});
```

The bodies above describe required work, not a ready-to-enable adapter. [Bouncing Ball](../bouncing-ball/sketch.js) is the connected example.

- Keep the required IDs: `simulation-controls` (form), `simulation-fields` (fieldset), `reset-everything` (outside the form), `restart-simulation` (inside), and `simulation-status` (visible `role="status"` message). Keep the reset button's `type="reset" form="simulation-controls"` and restart's `type="button"`.
- Give each setting an associated label, unique `id`, and `name`. Names become keys in a plain object. `range` and `number` values become finite numbers, checkboxes become booleans (including unchecked `false`), and other single-value fields remain strings. Radio groups use one name and the checked value. Use only single-value inputs, selects, and textareas; file uploads, multi-selects, and repeated names other than radio groups are not supported.
- Keep initial values in HTML: `value`, `checked`, textarea text, or an option's `selected` attribute. Provide `<output for="field-id">` for each slider, with units in adjacent text. The controller updates outputs automatically. Number controls must always contain valid finite values; add project-specific range/validity handling if the supplied simulation needs editable number fields.
- Connection reads the defaults, updates outputs, calls `applySettings(settings)`, then `restart(settings)`. It then enables the controls and announces readiness.
- Every form `input` or `change` event reads **all** named settings and calls `applySettings` with a fresh object. Treat it as read-only; make the callback idempotent and safe during animation. It must not restart on every update. The controller keeps its own current settings; simulation code should not read the form directly.
- **Restart Simulation** rereads and applies current settings, then calls `restart(settings)`. No control value changes. The adapter must use the supplied settings, including any restart-only fields.
- **Reset Everything** uses the form's native reset, restoring all HTML defaults, including checkboxes. The reset-event handler waits until those defaults are restored, then rereads settings, updates outputs, applies settings, and restarts. It also handles a direct `form.reset()` call. No page reload is used.
- Failed or missing adapters must not be hidden behind enabled, nonfunctional buttons. Initialization exceptions remain visible in the console, and the pre-connection status explains why controls are disabled. Keep useful no-script text.

For Bouncing Ball the settings shape is `{ color: string, count: number, diameter: number, collisions: boolean }`; appearance and collisions update live, while count applies at restart. Other projects define their own names and behavior independently.

## Canvas sizing: choose per project

The shared CSS scales the displayed canvas; it never calls p5.js or changes simulation coordinates. Set `data-sizing` on `#sketch` and declare the project's aspect ratio using `--canvas-aspect-ratio` (default `16 / 10`). Do not install a resize handler blindly.

### Fixed logical dimensions

For a simulation designed around 800 by 500 logical pixels:

```html
<div id="sketch" class="sketch-stage" data-sizing="fixed"
     style="--canvas-logical-width: 800px; --canvas-aspect-ratio: 800 / 500;">
</div>
```

Keep its original `createCanvas(800, 500)` and parent the canvas to this host. Do **not** call `resizeCanvas` on host or window changes. CSS limits the host to the logical width and scales the displayed canvas uniformly on smaller screens without changing coordinates or physics. Declare the actual logical width and matching ratio, not the sample values. Verify pointer hit-testing at the scaled size with the project's p5.js version; custom pixel-coordinate handling may need project-specific conversion.

### Responsive dimensions

Use `data-sizing="responsive"` and the declared aspect ratio. In the project's setup, measure the host width and calculate logical height from that ratio before creating the canvas. Observe **the host** with `ResizeObserver`; when its width changes, recalculate dimensions, call `resizeCanvas`, and constrain or reposition **every** simulated object to the new bounds. Guard against unchanged sizes and zero dimensions. Do not restart or discard state unless the simulation requires it.

Bouncing Ball measures host width, rounds logical dimensions to whole pixels at 16:10, and constrains all balls after every resize and diameter change. Responsive canvas CSS preserves the exact declared display ratio despite logical pixel rounding. Its observer responds to layout changes as well as window resizing. Any separate project-owned observers/listeners must be installed once, not again on restart.

## Before enabling or publishing

- Use native HTML controls, not `createSlider()`/`createButton()`. Preserve all existing features when replacing old controls. Use the shared tokens, field/button styles, visible focus, labels, outputs, and responsive layout; add only genuinely project-specific styles.
- Serve the repository over local HTTP, also under a non-root URL prefix to emulate GitHub Pages. Check exact filename case and relative paths (`../../index.html`, `../../assets/...`, local assets). No framework, package installation, build, or backend is needed.
- Check console/network errors, p5.js loading, the Back to Portfolio link, and the exact project's GitHub directory URL. The template's placeholder source URL is intentionally not a valid project destination until replaced.
- Verify live updates during animation, restart-only settings, repeated restarts without control changes, full reset of every default and output, and a direct form reset. Test a failed/unconnected adapter: controls must remain disabled.
- Test desktop, narrow/mobile widths, host resizing, correct aspect ratio, bounded objects, no horizontal overflow, Tab/Shift+Tab focus order, arrow-key sliders, native picker/checkbox behavior, and keyboard button activation. Confirm existing mouse and keyboard interactions still work.
- Start How to Use with an actions/shortcuts list. Describe actual controls and explicitly say when custom shortcuts or canvas mouse controls do not exist. Do not claim keyboard canvas interaction that was never implemented.
- Run existing applicable repository checks; there is currently no build or test runner. At minimum check changed JavaScript syntax, local assets, and the working page in a browser. Keep new or modified user-facing text and documentation in English.
