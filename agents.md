# p5.js portfolio - development guidelines

## Project purpose

This is a **distribution project**: the root portfolio collects, presents, and provides access to independent p5.js subprojects. The subprojects are the substance of the repository; the landing page is primarily a catalog and navigation, not a shared simulation application.

Review and standardize projects individually. Do not assume they already share a structure, and do not perform cross-project migrations without an explicitly agreed task. Older pages are intentionally not migrated just because a new page pattern exists.

## Tools and technologies

- HTML, CSS, and native JavaScript; no central framework, build step, or backend.
- Each project manages its own p5.js version and other dependencies according to its needs, using local or CDN files.
- Use VS Code and a browser for development. Serve projects that load files through a local HTTP server, such as VS Code Live Server.
- Deployment is static GitHub Pages.

## Development principles

- Keep changes inside the affected project's folder unless the task explicitly covers shared assets, the portfolio, or multiple projects.
- Every project must open independently through its own `index.html` and include the files it requires.
- Use short lowercase, ASCII, hyphenated folder names without spaces. Use relative resource paths.
- Preserve the project's working behavior and dependency choices. Introduce shared patterns or dependencies only after reviewing each affected project individually. Shared page assets must not create dependencies between simulations.
- Update landing-page links, preview assets, and project documentation when the task calls for **adding a project**. Do not update the listing merely to migrate an existing project page or improve the template.
- Write all new or modified user-facing text and documentation in **English**. Future project pages must use `lang="en"` and English titles, summaries, metadata, labels, accessible names/descriptions, no-script messages, help, status text, and documentation. Do not translate unrelated legacy pages or the root README as a side effect.
- Verify modified projects in a browser. Use relative paths without a leading `/` and exact filename case so GitHub Pages works beneath the repository URL.

## Integrating an existing simulation

1. Inspect the supplied project's code, folder, dependencies, assets, current controls, custom shortcuts, mouse interactions, and planning notes before editing. Preserve all working features, physics, and dependency versions unless the requested integration requires a specific change.
2. Copy [projects/_template/](./projects/_template/) into `projects/<project-slug>/`. Follow its [README](./projects/_template/README.md). Keep existing project-specific files where possible; adapt the page shell rather than replacing the simulation with a simplified example.
3. Replace all template placeholders, including the project title, two- or three-sentence summary, metadata, canvas description, example settings, help text, and GitHub `PROJECT-SLUG` URL. Load the project's original dependencies in the correct order. Do not publish a template source link pointing to another project or `#`.
4. Use the shared [stylesheet](./assets/css/style.css) and small [page controller](./assets/js/project-page.js). Do not copy their styles/listeners into each project or turn the controller into a generic simulation framework. Simulation-specific behavior stays in the project's files.
5. Choose the sizing mode explicitly. **Fixed** projects retain original logical dimensions and uniformly scale the displayed canvas down on small screens; set the logical width and matching aspect ratio and do not resize their simulation coordinates. **Responsive** projects derive logical dimensions from their host and declared ratio, observe host changes, and safely constrain/reposition every object after resizing. Preserve state unless the project requires otherwise. Never resize every simulation by default.
6. Use native, labeled HTML controls, not p5.js DOM helpers. When replacing existing controls, preserve their full feature set. Add unique IDs and setting names, correct HTML defaults, useful slider outputs, visible focus, and responsive styling. Keep fields and buttons in the shared visual system.
7. Implement the documented `ProjectPage.connect({ applySettings, restart })` adapter only once the real simulation is ready. The controller reads named controls into a plain settings object: numeric fields are numbers, checkboxes are booleans, and other supported single-value fields are strings. Apply live changes during animation; explicitly explain any settings that require restart. Do not leave enabled controls connected to empty callbacks.
8. Keep the actions distinct: **Restart Simulation**, inside the control panel, restarts only simulation state using current settings and leaves controls unchanged. **Reset Everything**, outside the panel, restores every HTML control default, synchronizes settings and outputs after the native form reset, and restarts with defaults. Neither action reloads the page.
9. Start How to Use with a list of actual shortcuts and actions. Describe each field, restart-only behavior, and existing mouse interactions. Explicitly state when there are no custom keyboard shortcuts or canvas mouse controls; do not invent supported interactions or claim mouse-only canvas actions have keyboard equivalents.
10. Near the bottom, keep a longer-form Project Information area with English headings and visibly marked empty content until content is requested. Inspect **all original planning comments and project notes** and surface actual plans, next steps, and disclaimers in its **Next Steps** block, translated to English and linked to their source files (with line references where useful). Preserve provenance. Do not extract ordinary explanatory comments, commented-out code, or third-party library TODOs. Do not invent history, ideas, references, or future plans. If no such notes exist, leave the block clearly empty.

## Validation

- Discover available checks and run the smallest applicable ones. There is currently no build or automated test framework; check changed JavaScript syntax and local asset paths without introducing tooling dependencies.
- Run the site through local HTTP and test a repository-path URL prefix, not only the domain root. Verify the Back to Portfolio link, exact GitHub project directory link, asset paths, dependency loading, and console/network errors.
- Test live setting changes, restart with changed restart-only settings, repeated restarts without altered controls, full reset of all HTML defaults and outputs, and a direct form reset. Controls must remain visibly disabled while the adapter is missing or initialization fails.
- Check desktop and narrow/mobile widths, no horizontal overflow, declared canvas aspect ratio, resize behavior and object bounds, keyboard focus/order, slider keys, native picker/checkbox behavior, and button activation. Verify all preserved mouse and keyboard interactions and the accuracy of How to Use.
- Keep projects independent and limit fixes to the requested integration. Do not migrate the landing page or other simulations as incidental cleanup.
