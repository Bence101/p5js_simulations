# p5.js projects

This folder contains completed, independent simulations, each in its own directory. The portfolio is a catalog, not one shared simulation application. Preserve each project's behavior, assets, p5.js version, and other dependency choices.

## Adding a project

Start from [_template/](./_template/), a partly empty page shell for integrating an already-built simulation. Copy it into a new project directory, bring in the supplied simulation, and follow the [template integration guide](./_template/README.md). It documents the minimal adapter, native controls, full reset versus simulation restart, sizing modes, and pre-publication checks.

Example target layout (the `flow-field` example is not created):

```text
projects/
|-- _template/           # Copyable shell; not a portfolio entry
|-- bouncing-ball/       # First connected example
`-- flow-field/          # Example new project
    |-- index.html
    |-- sketch.js
    |-- README.md
    `-- assets/
```

- Use short lowercase, ASCII, hyphenated directory names without spaces.
- Every project has its own `index.html`, loading its required p5.js version and any other existing dependencies. No framework, build step, backend, or new dependency is required by the page template.
- Use the shared [project stylesheet](../assets/css/style.css) and [page controller](../assets/js/project-page.js) for template-based pages; keep simulation-specific logic inside the project.
- Replace every template placeholder and `PROJECT-SLUG` source URL. Controls remain disabled until a real adapter connects successfully; the template must not pretend to run a simulation.
- Use English for all new or modified page text and documentation, with `lang="en"` on new project pages. Older pages are not translated or migrated automatically.
- Choose fixed logical dimensions with uniform display scaling, or responsive host-based dimensions with an explicit aspect ratio and safe object resizing. Follow the template guide rather than blindly resizing every project.
- Surface original plans, next steps, and disclaimers in the page's Next Steps area with source-file links. Do not copy all comments or commented-out code, and do not invent project history or long-form content.
- Use relative resources such as `./assets/image.png`, shared paths such as `../../assets/css/style.css`, and the return link `../../index.html`. Match filename case exactly for GitHub Pages, including when hosted beneath the repository path.
- When a task actually adds a project, update the root portfolio listing with a relative link such as `./projects/flow-field/`, add its preview under `assets/images/`, and update relevant documentation. Do not list `_template` or migrate unrelated pages.
- GitHub Pages serves static files only. Projects requiring server-side code need a separate service.

## Working example and verification

[Bouncing Ball](./bouncing-ball/index.html) is the first connected example; its [README](./bouncing-ball/README.md) lists the controls and expected behavior. Learning Snake and Particle Life retain their older, independent page structures.

There is no build or test framework. Check changed JavaScript syntax and asset paths, then serve locally and inspect the console/network, both navigation links, live updates, restart with unchanged controls, full default reset, aspect ratio and resize bounds, keyboard accessibility, and desktop/mobile overflow. Test under a non-root URL prefix to reflect GitHub Pages hosting. See the [agent guidance](../agents.md) for the full integration checklist.