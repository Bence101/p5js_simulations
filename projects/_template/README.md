# Project-page template

Copy this folder when integrating an **already-built, independent simulation**. It is a content starter for the centrally maintained [page shell](../../assets/js/project-shell.js), not a copy of the shared layout or a simulation framework. Existing opted-in pages receive shared structure/style changes on their next load; they do not need to be recopied from this folder.

The sample controls are deliberately disabled, no p5.js dependency is loaded, and `data-source-url` contains the explicit `PROJECT-SLUG` placeholder. Do not publish the copied page in that state.

## Integration checklist

1. Read the root [agent guidance](../../agents.md) and inspect the supplied simulation, dependencies, assets, controls, interactions, and planning notes. Preserve its behavior and dependency versions; do not migrate other projects.
2. Copy this folder to `projects/<project-slug>/`, using a short lowercase, ASCII, hyphenated slug. Bring in the existing simulation files and assets without losing features. Keep the shared stylesheet, shell, and controller paths in [index.html](./index.html). Do not copy their implementation or generated markup into the project.
3. Replace the title, metadata, accessible canvas description, two- or three-sentence summary, sample controls, and help content with accurate English text. Replace **every** `PROJECT-SLUG` occurrence, including the root's `data-source-url`, with the actual directory slug. Remove the canvas placeholder. Load deferred scripts in this order: shared shell, shared controller, original p5.js/dependencies, then project scripts.
4. Choose `data-layout="sidebar"` or `"stacked"` on the project root and one explicit canvas sizing mode below. Page layout and logical canvas sizing are separate decisions. Keep p5.js setup, resizing, and simulation state inside the project.
5. Connect a real adapter after the simulation is ready. Keep the project's controls-slot fieldset disabled in source HTML; the shell and controller preserve the disabled state until initial settings and restart succeed. Do not author copies of the shared buttons. Never connect empty callbacks to make a page look functional.
6. Omit the optional background slot until content is requested; the shell shows a visibly empty Background and References block. Inspect original source comments and project notes for actual plans, next steps, and disclaimers; supply those through the next-steps slot in English with relative source-file links (and line references where useful). Omit that slot if no notes exist. Do not extract ordinary comments, commented-out code, or third-party library TODOs. Do not invent history or plans.
7. Verify the checks below. Update the portfolio listing, preview image, and relevant documentation **only when the task calls for adding a project**. Do not list `_template` as a portfolio project.

## Shared shell contract

The shell runs synchronously from its deferred script, before simulation setup. It requires exactly one `<main data-project-page>` root with:

- `data-layout="sidebar"` for compact controls beside the canvas, or `"stacked"` for wide/complex controls below it. Sidebar layout also stacks on narrow screens. Both variants are maintained in shared CSS, not project-specific workspace overrides.
- `data-source-url="https://github.com/.../tree/main/projects/<project-slug>"`: the exact absolute HTTPS source-directory URL.
- Direct-child content slots as described below. Each slot appears at most once. Unsupported slots, missing required slots, invalid layout/source configuration, and reserved-ID collisions throw visible initialization errors instead of guessing defaults.

| `data-project-slot` | Required | Project-owned content |
| --- | --- | --- |
| `intro` | Yes | Header containing the project's h1 and summary |
| `canvas` | Yes | The actual `#sketch.sketch-stage` host with sizing attributes, accessible description, and no-script message |
| `controls` | Yes | A **disabled fieldset with its own legend**, containing native controls, groups, outputs, and any project-specific action buttons |
| `help` | Yes | Project-specific usage instructions; the shell supplies the How to Use heading |
| `background` | No | Background/reference content, without another copy of the shared heading |
| `next-steps` | No | Source-linked original plans and disclaimers, without another copy of the shared heading |
| `extra` | No | One container holding any number of additional project-specific sections, including their own headings and unique IDs |

Omit empty optional slots. Background and Next Steps get shared empty-content placeholders; an absent extra slot creates no block. Native HTML is intentional: do not replace complex controls or longer content with a JSON control schema.

The starter's `data-project-fallback` paragraph is the only non-slot direct child. It provides a static return link and an uninitialized-interface warning if JavaScript/the shell is unavailable. The shell removes it only after successful mounting. Project content remains HTML, and the controls-slot fieldset remains disabled if mounting fails.

### Ownership and global changes

| Change | Edit once here |
| --- | --- |
| Standard sections/headings, wrappers, navigation, source-link presentation, standard button placement, or section order | [project-shell.js](../../assets/js/project-shell.js) |
| Theme, spacing, field/button styling, sidebar/stacked layout, and mobile breakpoints | [style.css](../../assets/css/style.css) |
| Fixed canvas display dimensions, typed settings, outputs, sketch-provided control defaults, native reset synchronization, and restart dispatch | [project-page.js](../../assets/js/project-page.js) |
| A project's content, control defaults, extra actions, matrix mapping, simulation, dependencies, or logical canvas resizing | That project's files |

The shell's single markup definition is the source of truth for shared structure. Add a generic notice/block or move standard buttons there, not in every project. Existing opted-in pages use the changed structure on reload; adding a new block that needs unique project information still requires authoring that information per project. Unmigrated pages and the landing page are not automatically opted in.

Keep the shell as a page compositor, not a simulation framework. Preserve the standard IDs, form association, disabled-state handling, accessibility labels, and logical DOM/keyboard order when rearranging it. If a new shared block introduces an ID, reserve it centrally and document any new content slot. Use the existing extra slot for project-only additions rather than expanding the shared API for every simulation.

For later global changes:

1. **Add a common block:** put its markup in the shell's single `template.innerHTML` definition and any styling in shared CSS. If its content is common to all projects, no project HTML changes are needed.
2. **Move a standard button or section:** move the existing markup in that same definition, preserving button IDs, types, reset's form association, and initial disabled state. Change actual DOM order, not just CSS visual order. Keep restart inside the control panel.
3. **Add a common area with unique project content:** add one supported optional slot and its placeholder/default in the shell, then document it here. Only projects needing custom content supply that slot; the rest use the shared default.

### Initialization and node preservation

1. The browser parses the project's HTML, including native controls and the disabled controls fieldset.
2. The deferred shell validates the slots, creates the common structure, and **moves the original content nodes** into it. No HTML fragment is fetched; controls and the canvas host are not cloned.
3. The controls slot becomes a child of the shell's disabled `#simulation-fields`. Only its fallback-only disabled attribute is released; nested project-disabled groups are left alone.
4. Project setup creates its real canvas, generates any additional controls, and connects the adapter once. When supplied, sketch defaults are applied to the controls and their native reset values before the controller reads settings, restarts, and enables the shared fieldset and standard buttons.

Do not load the shell with `async`, defer mounting until after p5.js setup, rerender it during animation, or replace its nodes after connection. Project scripts can rely on the standard IDs by setup time. Missing/broken shell or adapter initialization must leave a visible warning/disabled controls and console errors, never a success-shaped fallback.

The page's title/description metadata remains static in its own head. Complete generic structure requires JavaScript; there is no build step or new dependency. Keep the fallback useful rather than claiming fully rendered no-JavaScript pages.

## Inventory before replacing controls

Record the original behavior before writing the new markup. Keep the inventory in the affected project's README so implementation and validation use the same reference:

- For every field, record its type, range, step, default, model mapping, and whether it applies live or on restart. Include dynamically generated controls, not just controls visible in the original HTML.
- For every action, record what it recreates or randomizes and what it leaves unchanged. A population-regeneration action may ignore the brush count/color; matrix regeneration may treat its diagonal differently from initial setup.
- Trace mouse and keyboard handlers, including focus-dependent shortcuts, boundary checks, radius-zero behavior, and whether dragging is actually implemented. Do not infer interactions from labels.
- For a matrix, record its full dimensions, row/column direction, group-index order, diagonal rules, and whether opposite entries are independent. Verify the mapping against the simulation's force/update code, not just the old panel's colors.
- Compare selector names, matrix markers, and rendered colors. If they disagree, preserve the numeric mapping and explain the legacy discrepancy rather than silently reordering groups or making an unrelated correction.

[Particle Life's inventory](../particle-life/README.md#preserved-controls-and-actions) is a complex-control example; Bouncing Ball remains the simpler adapter reference.

## Control-to-simulation contract

[project-page.js](../../assets/js/project-page.js) exposes one method:

```js
// Call once, from setup() or the supplied simulation's equivalent ready callback.
ProjectPage.connect({
  canvas, // The p5 renderer returned by createCanvas(); required for fixed sizing.
  defaults, // Optional object keyed by the controls' name attributes.
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

The bodies above describe required work, not a ready-to-enable adapter. [Bouncing Ball](../bouncing-ball/sketch.js) is a connected responsive example, where `canvas` is optional; [Particle Life](../particle-life/sketch.js) demonstrates fixed sizing.

- The shell supplies the required IDs: `simulation-controls` (form), `simulation-fields` (disabled outer fieldset), `reset-everything` (outside the form), `restart-simulation` (inside), and `simulation-status` (visible `role="status"` message). It also owns `controls-title`, `how-to-use`, `project-information`, `project-background`, and `next-steps`. The background heading uses `project-background`, not `background`, to avoid creating a named window property that conflicts with p5's global `background()` function; the content slot is still named `background`. Do not reuse these IDs or author the standard buttons/forms/headings in project slots. Keep reset's `type="reset" form="simulation-controls"` and restart's `type="button"` when changing the shared shell.
- Give each setting an associated label, unique `id`, and `name`. Names become keys in a plain object. `range` and `number` values become finite numbers, checkboxes become booleans (including unchecked `false`), and other single-value fields remain strings. Radio groups use one name and the checked value. Use only single-value inputs, selects, and textareas; file uploads, multi-selects, and repeated names other than radio groups are not supported.
- For sketch-owned defaults, pass `defaults` as an object keyed by each control's `name`. The controller sets both current and native reset values before initial synchronization; HTML can then contain only the control structure, labels, and constraints. If `defaults` is omitted, native HTML values remain in use. Provide `<output for="field-id"></output>` for each slider, with units in adjacent text. The controller updates outputs automatically. Number controls must always contain valid finite values; add project-specific range/validity handling if the supplied simulation needs editable number fields.
- For fixed sizing, connection first validates `canvas` and derives the host's maximum width and aspect ratio from its logical dimensions. It then reads the defaults, updates outputs, calls `applySettings(settings)`, then `restart(settings)`. It enables the controls and announces readiness only after successful initialization.
- Every form `input` or `change` event reads **all** named settings and calls `applySettings` with a fresh object. Treat it as read-only; make the callback idempotent and safe during animation. It must not restart on every update. The controller keeps its own current settings; simulation code should not read the form directly.
- **Restart Simulation** rereads and applies current settings, then calls `restart(settings)`. No control value changes. The adapter must use the supplied settings, including any restart-only fields.
- **Reset Everything** uses the form's native reset, restoring defaults established by the controller (from the sketch when `defaults` is supplied), including checkboxes. The reset-event handler waits until those defaults are restored, then rereads settings, updates outputs, applies settings, and restarts. It also handles a direct `form.reset()` call. No page reload is used.
- Failed or missing adapters must not be hidden behind enabled, nonfunctional buttons. Initialization exceptions remain visible in the console, and the pre-connection status explains why controls are disabled. Keep useful no-script text.

For Bouncing Ball the settings shape is `{ color: string, count: number, diameter: number, collisions: boolean }`; appearance and collisions update live, while count applies at restart. Other projects define their own names and behavior independently.

### Generated controls and random defaults

- Create every named setting **after the shell mounts and before** calling `ProjectPage.connect()`. The controller captures the controls once; replacing their DOM nodes afterward leaves it reading detached controls. Randomization should update existing controls, not rebuild the panel.
- Give each matrix entry its own setting name and accessible label identifying both affected and neighboring groups. Map those flat settings back into the simulation's matrix inside the project adapter; no shared matrix/simulation framework is needed.
- If the original simulation starts with random settings, sample them once during initialization and include those values in the `defaults` object passed to the controller. For a generated range input, assign its value before connection so its browser-normalized value can be included:

  ```js
  input.value = String(initialValue);
  ```

  The controller establishes both the current and native reset values from `defaults`. Later randomization changes only `.value`, never `.defaultValue`. Document this distinction from drawing a new random configuration.
- Keep display formatting separate from model precision. An arbitrary random fraction should not be rounded to two decimals or unintentionally quantized by `step="0.1"`. A range with `step="any"` can retain native numeric precision while project-specific keyboard handling preserves an existing 0.1 increment. Browsers may normalize floating-point serialization; do not promise bit-for-bit preservation of the original sample.
- The controller writes slider outputs before calling `applySettings`. Project-specific formatting, such as a two-decimal matrix output, can be applied there without changing the numeric setting or dispatching another event.
- Programmatic `.value` changes do not emit input events. After a batch randomization, dispatch one bubbling `input` event from the form or a descendant so the controller reads every updated value and applies settings once. Do not update only simulation globals: restart would reread stale controls.

### Keeping large matrices usable

Use a semantic table with row/column headers and native labeled controls; color alone is not a group label. Choose the shared stacked layout for a large panel. Within the controls slot, use project-owned markup/CSS for multiple button groups, sliders, fieldsets, matrices, or other controls while retaining shared tokens, field/button styles, and focus styling. Extra actions should be `type="button"` and keep their behavior/listeners local; they inherit the shared disabled fieldset until connection.

On narrow screens, contain horizontal scrolling in a focusable, named matrix region, not the document. Keep affected-group row headers visible with sticky positioning. Account for those headers with scroll padding, and verify that each focused control is **fully** visible rather than partly hidden behind a sticky header or viewport edge. Native focus scrolling may leave a partially visible slider clipped; a project-local `focusin` handler using `scrollIntoView({ block: "nearest", inline: "nearest" })` can resolve this without changing shared wiring.

## Canvas sizing: choose per project

The shared CSS scales the displayed canvas; it never calls p5.js or changes simulation coordinates. Set `data-sizing` on `#sketch`. Fixed projects derive their display dimensions from `createCanvas()` at connection; responsive projects declare their aspect ratio using `--canvas-aspect-ratio` (default `16 / 10`). Do not install a resize handler blindly.

### Fixed logical dimensions

For a simulation designed around 800 by 500 logical pixels:

```html
<div id="sketch" class="sketch-stage" data-project-slot="canvas" data-sizing="fixed"></div>
```

In the simulation's setup:

```js
const canvas = createCanvas(800, 500);
canvas.parent("sketch");
ProjectPage.connect({ canvas, applySettings, restart });
```

`createCanvas()` is the single source of truth for fixed dimensions: change its arguments to change the logical size and display ratio. Do not repeat width or ratio values in HTML. At connection, the controller sets `--canvas-logical-width` and `--canvas-aspect-ratio` on the host from the p5 renderer's logical `width` and `height`, not the density-scaled canvas bitmap. Missing canvases, canvases outside the host, and non-positive or non-finite logical dimensions throw an initialization error and leave controls disabled.

CSS displays the canvas at its natural logical size when space permits and scales it uniformly **down, never up**, to fit smaller containers. The sidebar, page width limit, and viewport can constrain the displayed width. Do **not** call `resizeCanvas` on host or window changes: logical coordinates and physics remain unchanged. Fixed dimensions are synchronized once at connection, not observed for runtime changes.

Existing content positions and geometry remain project-owned; changing canvas dimensions does not automatically rearrange charts or objects. Verify pointer hit-testing at the scaled size with the project's p5.js version; custom pixel-coordinate handling may need project-specific conversion.

### Responsive dimensions

Use `data-sizing="responsive"` and the declared aspect ratio. In the project's setup, measure the host width and calculate logical height from that ratio before creating the canvas. Observe **the host** with `ResizeObserver`; when its width changes, recalculate dimensions, call `resizeCanvas`, and constrain or reposition **every** simulated object to the new bounds. Guard against unchanged sizes and zero dimensions. Do not restart or discard state unless the simulation requires it.

Bouncing Ball measures host width, rounds logical dimensions to whole pixels at 16:10, and constrains all balls after every resize and diameter change. Responsive canvas CSS preserves the exact declared display ratio despite logical pixel rounding. Its observer responds to layout changes as well as window resizing. Any separate project-owned observers/listeners must be installed once, not again on restart.

## Before enabling or publishing

- Use native HTML controls, not `createSlider()`/`createButton()`. Preserve all existing features when replacing old controls. Use the shared tokens, field/button styles, visible focus, labels, outputs, and responsive layout; add only genuinely project-specific styles.
- Serve the repository over local HTTP, also under a non-root URL prefix to emulate GitHub Pages. Check exact filename case and relative paths (`../../index.html`, `../../assets/...`, local assets). No framework, package installation, build, or backend is needed.
- Check console/network errors, p5.js loading, the Back to Portfolio link, and the exact project's GitHub directory URL. The template's placeholder source URL is intentionally not a valid project destination until replaced.
- Verify live updates during animation, restart-only settings, repeated restarts without control changes, full reset of every default and output, and a direct form reset. Test a failed/unconnected adapter: controls must remain disabled.
- Test desktop, narrow/mobile widths, host resizing, correct aspect ratio, bounded objects, no horizontal overflow, Tab/Shift+Tab focus order, arrow-key sliders, native picker/checkbox behavior, and keyboard button activation. For fixed sizing, vary only the `createCanvas()` arguments to verify smaller, larger, and changed-ratio canvases, no upscaling, and density-independent logical sizing. Confirm existing mouse and keyboard interactions still work.
- Validate the shell on the unconnected template, sidebar Bouncing Ball, and stacked Particle Life. Check that the canvas host/control nodes survive mounting, optional placeholders and extra sections render correctly, invalid slots/configuration fail explicitly, and unavailable shell/adapter code leaves controls disabled. For shared structural changes, verify both reference pages receive the change without editing their HTML; do not rely only on a fresh copy of the starter.
- For complex panels, test every matrix mapping and keyboard-focus position, not just the entry count or one representative slider. Use asymmetric values to detect transposed/mirrored mappings and check the actual simulation response. Test both initial and regenerated diagonal values.
- After randomizing settings, check repeated restarts retain every value and recreate simulation state; full reset and direct `form.reset()` must restore the original defaults and outputs, not the latest randomization. Deterministic checks may pause animation, but also verify live updates while it runs and restore a normal running page afterward.
- Check scaled canvas input at desktop and mobile sizes using the original dependency version. Test touch separately from mouse emulation when available: legacy p5.js touch fallbacks and compatibility mouse events can produce duplicate actions. Distinguish existing behavior from migration regressions; document retained limitations instead of silently upgrading dependencies or changing unrelated behavior.
- Start How to Use with an actions/shortcuts list. Describe actual controls and explicitly say when custom shortcuts or canvas mouse controls do not exist. Do not claim keyboard canvas interaction that was never implemented.
- Run existing applicable repository checks; there is currently no build or test runner. At minimum check changed JavaScript syntax, local assets, and the working page in a browser. Keep new or modified user-facing text and documentation in English.
- If a command-line JavaScript runtime is unavailable, the browser's parser can syntax-check these classic scripts without installing tooling; this does not replace behavioral checks. Report tested widths, browser/emulation scope, actual results, and remaining limitations. Separate intentionally injected initialization errors from normal-load console/network errors, and stop temporary validation servers when finished.
- Run animation/resize checks in a visible or focus-emulated browser page. Hidden embedded tabs can suspend animation frames and resize-observer delivery; distinguish a paused validation environment from a simulation regression before changing production code.

### Shared-shell reference validation

The shared-shell integration was checked in Chromium at 1440, 1024, 390, and 320 px under a repository URL prefix:

- The unconnected template, sidebar Bouncing Ball, and stacked Particle Life render one common shell with correct assets, links, IDs, form associations, and no document overflow.
- A temporary test version of **only the shared shell script** added a common block and relocated both standard buttons on all three pages. Original canvas hosts, controls, defaults, and pre-existing listeners survived mounting; relocated reset still worked. No project HTML was changed for this test.
- Native nested fieldsets, multiple custom actions/control types, optional content, and multiple extra sections were exercised with a browser fixture. Typed settings, custom actions, restart/reset, and intentionally disabled nested groups were preserved.
- Both reference simulations retained live controls, restart/reset and direct form reset, mouse interactions, fixed/responsive sizing, and simulation state/bounds. All 36 Particle Life mappings, actual force directions, and keyboard-focus positions were checked.
- Missing scripts, failing adapter callbacks, invalid configuration/slots, and JavaScript disabled were tested separately from normal loading. Normal loads produced no console/network errors; fallback warnings and disabled controls remained in failure cases.

### Canvas sizing regression validation

The canvas adapter was checked in Chromium under `/p5js_simulations/`:

- Flocking, Neural Network Visualization, Learning Snake, and Particle Life retained their original logical dimensions at viewport widths of 1440, 1024, 801, 800, 390, and 320 px. Canvas and host ratios matched, controls initialized, and settled layouts had no horizontal overflow. Local assets and navigation links loaded without console or network errors.
- Browser-only sketch overrides changed only the canvas creation dimensions: Flocking at 400 x 300, 400 x 600, 600 x 600, and 1600 x 900; Neural Network Visualization at 600 x 900 and 1000 x 700. Desktop and 320 px checks confirmed correct host dimensions, ratios, downscaling, and no upscaling. Flocking at 400 x 300 and Neural Network Visualization at 1000 x 700 also passed with p5 `pixelDensity(2)`: doubled bitmap dimensions did not double the displayed dimensions. The overrides were not saved to the sketches.
- All four fixed projects passed live-setting changes, animation, three repeated restarts retaining settings, full reset of native defaults, direct form reset, output synchronization, and preservation of the original canvas element and dimensions.
- Flocking's four canvas actions and outside-click rejection passed at desktop and mobile widths, including a changed-ratio 400 x 600 canvas at pixel density 2. Particle Life's scaled mouse creation and deletion passed at desktop and 320 px.
- Bouncing Ball retained its host observer, logical resizing, exact displayed 16:10 ratio, object identities, and object bounds through all six viewport widths and back to desktop. Live settings, restart, and reset still worked without requiring a canvas in its responsive adapter.
- Isolated controller fixtures rejected 14 invalid canvas configurations without enabling controls or applying settings. Valid fixed sizing used logical rather than bitmap dimensions; typed settings, duplicate-connection rejection, optional canvas for responsive sizing, adapter-failure handling, and the disabled unconnected template also passed.

These are browser/emulation checks, not a physical-device or cross-browser guarantee. The shared structure requires JavaScript, and each project's original dependency availability and documented legacy limitations still apply.
