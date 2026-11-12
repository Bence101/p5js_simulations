# Evolution Simulation - MVP Specification

## 1. Purpose and decision basis

Build an observe-first ecosystem in which a population survives, reproduces asexually, and evolves inherited physical and sensory traits. Within a couple of minutes, the observer should see trait diversity and signs that traits suited to the environment are becoming more common. This is the intended experience, not yet a quantified evolution benchmark.

This is the **standalone, authoritative product/MVP reference** consolidating the original project planning and all three discovery rounds. It is intended to remain the final source for future discussion and planning; the earlier planning and discovery documents may be archived. This specification preserves the decisions, rationale, useful prior-project lessons, and remaining questions needed to continue without relying on those files. Later explicit discovery decisions take precedence over earlier proposals.

The current project name is **Evolution Simulation**, in `projects/evolution-simulation`. This is a clean restart: do not reuse the older obstacle-avoidance simulation's code, architecture, navigation implementation, or original TODOs as a starting point or requirement. General lessons from other experiments may inform decisions, but do not require code reuse.

The MVP must be a foundation for future expansion, not a throwaway prototype. Preserve a practical path to replacing preset behavior with a brain-based system and adding sexual reproduction later, without implementing those features or an elaborate extension framework now.

**Reading convention:** agreed scope and constraints are stated directly. Items labeled candidate, example, optional, future, open, or recommendation are not additional fixed requirements. Acceptance criteria formalize how agreed intentions can be checked; they do not supply missing balance values or settle open mechanics. Rationale and superseded decisions are retained below so they cannot accidentally reappear as current requirements.

The original brain-led vision is a future direction. For the MVP, agents share preset behavior rules; differences in inherited capabilities and survival outcomes are the subject of evolution. Distinct learned strategies are not required.

Agents and their evolution remain the main attraction. The environment supplies meaningful navigation problems, resource opportunities, and selection pressures; environmental complexity is not an end in itself.

## 2. Intended user experience

- Open the deployed page into a live, mature-looking world initialized from a prepared evolution checkpoint, rather than an empty setup screen.
- Observe a cute, appealing, top-down meadow with a large crowd of agents. Keep graphics simple, legible, and reasonably self-descriptive.
- See a useful overview, then pan and zoom to examine individuals and local group behavior.
- Select and highlight an agent, inspect its inherited traits and current state, and relate those details to visible behavior and charts.
- Intervene in the current world or configure and generate a new simulation, with those actions clearly distinguished.
- Accelerate observation through fast-forward or skip-forward, and preserve evolutionary progress for later reuse.

The page includes a simulation canvas, native HTML controls, an inspection area, and charts below the simulation experience. Observation is primary; editing supports it rather than turning the MVP into a comprehensive world editor.

## 3. Scope

### In scope

- One species/population with continuous, rules-based survival and movement; individuals vary through inherited traits.
- A food-centered life cycle: personal reserves, consumption, eating, reproduction, ageing, and death.
- Asexual inheritance with variation and meaningful trait trade-offs.
- A bounded meadow, uneven food distribution, and blocked terrain/obstacles.
- Pan/zoom, individual selection and inspection, optional explanatory overlays, and supporting world intervention.
- Population and inherited-trait charts.
- Initial configuration, new-world generation, fast-forward, and skip-forward.
- Lightweight evolution checkpoints and reusable individual-agent recipes.
- Desktop-oriented static portfolio delivery, with roughly 1,000 living agents as the performance target.

### Explicitly out of scope / future

- Predation and predator-prey relationships. Distinct predator and prey species are a preferred later direction, not a current requirement.
- Water as a survival resource, swimming, shelter, and a multi-resource survival model.
- Sexual reproduction, mate compatibility, cross-breeding, and a transition from asexual to sexual reproduction.
- Neural-network or NEAT brains, evolving brain structures/weights, and within-life learning.
- Camera-follow for selected agents.
- Exact deterministic save/resume, full transient-state snapshots, and elaborate save migration/backward compatibility.
- A comprehensive live parameter editor; all simulation parameters should be inspectable through the GUI when needed, but editing every parameter is not required.
- Mobile-first optimization, elaborate art, complex frameworks, a backend, or a Node.js toolchain.

## 4. Ecosystem and evolution model

### Survival and behavior

Agents act continuously rather than taking discrete turns. They follow shared preset rules, such as seeking food when hungry and reproducing when eligible. Movement should communicate orientation, target, speed, and acceleration rather than look like unrelated random points.

The agreed ecological loop is:

1. Agents have a personal food reserve.
2. Maintaining life consumes that reserve over time; faster movement increases consumption.
3. Eating environmental food replenishes the reserve.
4. Insufficient reserves lead to death; sufficient reserves permit reproduction.
5. Offspring inherit traits with variation, and different survival/reproductive outcomes change the population over generations.

Ageing and lifespan belong in the life-cycle design. Exact death rules, reproduction costs and eligibility, mutation rules, and how hunger, energy, or health relate to the reserve remain open. Possible conceptual distinctions from the original vision include hunger as a drive, energy as a resource, and health as damage tolerance; no combination is selected. A separate health system is not decided merely because health appeared as an inspection example.

### Inherited traits and selection

The MVP must evolve both physical and sensory traits. The intended starting trait groups are **movement speed and body size**, **reproduction rate**, **lifespan**, and a sensory trade-off involving **detection range and field of view**. This is the planning baseline, not a finalized genome: exact gene definitions, pairing/coupling, ranges, equations, inheritance, mutation, and balancing still need decisions before implementation.

Every selected evolving trait should have a meaningful benefit and counterbalancing cost. Discovery examples include:

| Candidate | Illustrative trade-off, not a fixed rule |
|---|---|
| Speed | Faster movement consumes more food. |
| Size | Larger/slower agents may store more food. |
| Reproduction rate | More frequent reproduction or more offspring may require more food. |
| Lifespan | Longer life may allow later reproduction; whether this imposes a maturity delay or another cost is undecided. |
| Sensing | Narrow/far vision may trade against wide/shorter vision. |

Sensory traits are in MVP scope, not an optional later addition. The narrow/far versus wide/shorter vision trade-off is an initial design direction; its exact expression and sensing model remain open.

Final trait definitions, ranges, equations, inheritance/mutation details, sensory inputs, and balancing require decisions before implementation. Reserve values around 50 initially, death below 1, and reproduction above roughly 80-90 were examples only; none is a specified threshold. A possible relationship between body size/reserve capacity and the reproduction threshold was also raised, but the intended rule is unresolved.

The original vision also raised energy/reserve capacity and recognition ability as possible inherited properties. These remain candidates to assess, not additions to the agreed starting trait list. Distinguish an inherited capacity from the current reserve, and inherited lifespan from current age. Individuals within the same population should be able to differ; a species label must not force identical traits.

Adaptation should arise from the food environment and trait costs, not from a required learned strategy. Avoiding crowds while seeking abundant food was an exploratory example, not mandated behavior. There is no agreed artificial fitness formula, population cap, extinction recovery rule, or initial-population bootstrap.

### Sensing, recognition, and behavior explanation

The original sensing intent is to perceive nearby entities within a range and viewing cone, potentially with differences in recognition ability. Being able to recognize food and move toward it is an example of useful behavior. The exact MVP sensing rules, occlusion, target selection, and whether range/FOV evolve remain open.

No sensor implementation or input representation is selected: ray distances, entity categories, or other structured inputs are possibilities, not requirements. A drawn vision cone should not be taken as proof of what an agent actually perceives; inspection and diagnostics should explain the implemented sensing model.

Food, water, predators, mates, and members of the agent's own species were recognition examples in the broader vision. Only categories relevant to the agreed MVP need consideration now; this list does not reintroduce predation, mate-seeking, or water consumption.

### Reproduction, variation, and initial viability

Asexual reproduction is the MVP model, not merely a temporary aid before sexual reproduction. The exact division/birth mechanism, offspring count, eligibility, reserve transfer/cost, cooldown, maturity rules, and placement remain open.

Offspring must provide inherited variation for evolution, but which parameters mutate, mutation frequency/magnitude, bounds, and initial trait distributions have not been chosen. Neither population-wide generation resets nor a particular genetic selection algorithm is specified.

The original bootstrap concern remains useful: an initial population might die before useful adaptation can occur. Easier initial conditions, simpler starting behavior, and staged environments were unassessed ideas, not chosen solutions. Preset survival behavior changes the context of that concern but does not remove the need to test initial viability. Do not silently add rescue spawning or an automatic reproduction-mode transition.

## 5. Environment

- Use clear, closed world boundaries: no infinite world and no wrap-around. The edge need not be visually prominent, but its movement effect must be understandable.
- Compose a mostly continuous meadow with a few special areas. Exact special areas, map dimensions, and viewport dimensions remain open.
- Grass/field is the main walkable background.
- Distribute food in clusters of varying size, with some sparse food elsewhere, using simple placement rules rather than uniform scatter. Slight food-size variation is an idea, not a fixed requirement.
- Rocks and water are both obstacle types in the MVP and block movement. Water is terrain only: it is not a resource and cannot be swum through in this version.
- Boundaries and obstacles must have clear movement effects; agents cannot enter or pass through blocked terrain.

Candidate representations are rectangular or elliptical rocks, with most elliptical rocks appearing round; long, thin rectangular river-like water; and elliptical lake-like water. These are visual ideas, not a required shape catalog. Food quantity, depletion/regrowth, obstacle placement, collision/avoidance behavior, safe spawning, and generated-world viability remain to be defined.

Food exists as consumable map content, distinct from the grassy background and each agent's personal reserve. The original prototype context identifies a specific correctness risk: multiple agents may retain a target reference after food has been eaten. **Recommendation from that context:** explicitly define consumption/removal so depleted food cannot be consumed again or remain a usable stale target. Resource ownership and simultaneous competition rules are still design questions.

Whether environmental conditions change over time, including moving obstacles, was open in the original vision. Neither dynamic terrain nor moving obstacles is committed MVP scope.

## 6. Observation, charts, and controls

### Visual explanation and inspection

Keep the default scene natural and appealing. Combine visible trait differences, optional overlays, and detailed inspection without requiring all diagnostics to be shown at once.

Selecting any individual agent highlights it and reveals current state, with inherited traits as the primary focus. The inspector must distinguish inherited parameters from transient state; its exact fields and layout remain open. Size, speed, and reproduction rate are example inherited fields; food reserve, age, or health if implemented are example state fields. Sensory capabilities, perceived entities, current target, and behavior-related information are useful explanation candidates, not a finalized inspector schema. Pan/zoom also supports observing local groups and navigation without selecting an agent. Automatic camera-follow is deferred.

Provide a simple DOM selected-entity information area during development; a JSON-like display is sufficient. Include useful collision and vision diagnostics, with the initial set still to be selected. Exact trait encodings and user-facing overlay options remain open.

### Charts and collected data

- Show a population-over-time chart separately from trait-evolution charts.
- Provisionally provide a chart per finalized trait; counter-traits may share a chart.
- Keep data collection lightweight, with Chart.js as its visual layer.
- Preserve chart statistics in checkpoints.

Exact summaries, sampling intervals, chart refresh rate, history retention, and how history continues after load remain undecided. Average traits were examples, not a complete metric specification; charts should support understanding diversity and adaptation rather than merely showing activity.

Agent count over time, average sight length, and average size were specific chart examples. Keep chart choices open to later experimentation after the trait model is defined; no histogram, percentile, distribution view, or extra survival/resource chart is selected. Monitoring should explain how the population changes over the course of the simulation, not just describe the current frame.

### Controls and interventions

Provide initial settings such as map size and starting agent count, and a distinction between changing the current world and generating a new one. **All simulation parameters should be inspectable through the GUI when needed**, potentially in a side panel. Not every value needs its own slider or editable field; live parameter editing is useful but not required for every parameter.

Keep all simulation parameters defined from a single point or file. Identify which settings take effect immediately and which require restart/new-world generation. This does not require storing every entity's runtime state in one global object or flattening system-specific saved data.

Support selecting, adding, and removing world objects and basic adjustment such as obstacle sizing as the recorded intervention intent. The minimum editable object types, editable properties, interaction rules, and impact on ongoing statistics are still open; a full editor is not implied.

Time controls have two distinct meanings:

- **Fast-forward:** execute more stable simulation steps per real second while rendering less often. Do not enlarge the simulation step size to achieve speed.
- **Skip-forward:** execute a chosen number of steps without rendering, as fast as the computer allows, with no FPS or real-time pacing limit.

Rendering every 5th, 10th, or 100th step was illustrative, not a required preset list. Exact speed options, pause/resume behavior, skip progress/cancellation, shortcuts, and restart/reset semantics remain to be specified. Generating a new simulation must not be confused with loading a checkpoint.

## 7. Save, load, and reuse

### Evolution checkpoints

Use downloadable/uploadable `.json` files with a small format-version field. Validate imports before loading and clearly reject invalid or unsupported saves; do not build elaborate validation or migration machinery. Unsupported versions cannot be used in the MVP.

This is the deliberate effort-saving compromise to the original desire for a complete simulation save including map and objects. It must preserve evolutionary progress without the development cost of serializing and restoring every live interaction. It is intentionally non-deterministic.

Checkpoints preserve evolution progress rather than a precise moment:

- Preserve all inherited parameters of every living agent, relevant population/world metadata, and collected chart statistics. Population size is an explicit metadata example; the agent collection and any recorded count must agree.
- Group system-specific data coherently, such as agent parameters, map data, and statistics.
- On load, create fresh agents from saved inherited parameters, with new positions and fresh survival state.
- Reset **all short-term state**, including velocity, food reserve, age, and reproduction cooldown.
- Regenerate the world and agents from the saved data; exact map structure versus map-generation parameters remains undecided.

The prepared deployed showcase uses this checkpoint mechanism and begins running on entry. Its apparently mature population reflects saved evolutionary progress, not restoration of the agents' previous ages or positions.

Preserve and continue collected statistics after loading, rather than discarding history. Continued chart history must not imply deterministic continuity: loading changes survival conditions and resets short-term state. The history time axis, load-boundary presentation, sampling/retention, and exact saved metadata are unresolved. Clarify in the eventual user-facing workflow that this resumes evolutionary progress, not the precise prior simulation state.

### Individual-agent recipes

Support saving an individual's inherited recipe to a file and reusing it in the current or a later simulation. This preserves an agent definition, not the same living individual with its current state.

The exact recipe schema, relationship to checkpoint files, validation/versioning details, and import/spawn workflow remain open. JSON was specifically suggested for recipes; downloadable/uploadable JSON is the selected general save direction, but whether a recipe is a separate file type or a subset of a checkpoint is not decided. No separate species model or species-save system is required for this one-population MVP.

## 8. Technical constraints and development preferences

- Use **plain JavaScript**, **browser-native ES modules**, **p5.js** for visualization, **Chart.js** for charts, and **native HTML DOM controls**.
- No Node.js, including during development; no bundler/build step or backend. Serve locally over HTTP and deploy statically through the portfolio/GitHub Pages.
- Lightweight JSDoc/editor checking may be considered only if it preserves the simple workflow; it is optional, not a TypeScript or tooling requirement. Additional libraries or installs have no current commitment and need a clear benefit without unnecessary complexity.
- Load libraries from CDNs, pin exact versions, and clearly report required-library load failures. Version selection and any fallback remain open.
- Use modules by responsibility, for example simulation, world objects, rendering, and saves; these are illustrative responsibilities, not a fixed file tree.
- Use simple hybrid OOP: agents, map/world objects, and related entities own local state and simple behavior; shared systems coordinate global processes such as reproduction, resource updates, and collisions. OOP is the default, not an absolute rule. Avoid complex inheritance and technically complex patterns unless demonstrably needed or explicitly requested.
- Keep simulation updates mostly independent of rendering, DOM, and charts so they can advance without presentation. Presentation modules display state; DOM controls may issue simulation commands, including changing speed after fast-forwarding. Useful separation is the goal, not an absolute ban on communication between layers.
- Include a **quadtree early**, behind a shared spatial-query interface. This is the final discovery preference, superseding the earlier grid-versus-quadtree question.
- The early-index decision reflects the user's prior testing: approximately 1,000 agents were usually laggy without spatial indexing. Keep the strategy proportionate to this scale rather than adding speculative optimizations.
- A shared interface can hide insertion, update/rebuild, and nearby-query operations; the operation list is illustrative, not a prescribed API. Quadtree integration is not assumed to be identical to a grid: subdivision/maintenance and regular rebuild costs still need assessment in development planning.
- Target roughly 1,000 living agents, including rendering a crowd at that scale, on desktop/PC browsers. This is a goal, not a hard population limit or an already verified benchmark. A target machine/browser, update rate, and acceptable frame rate have not been agreed; mobile is not the primary target.
- Use the portfolio template as a guide, retaining overall style and main structure where practical while allowing justified deviations.
- Keep tests lightweight: focused simulation/save checks plus manual browser checks and useful visual diagnostics.
- Before implementation, agree a high-level development plan. Subsequent development prompts should propose detailed, reviewable next steps for user refinement and implementation by a new agent.

These are constraints and preferences, not a prescribed module layout or implementation sequence.

### Planning and review preferences

Proceed step by step in reviewable units so the user can inspect progress. Resolve broad product/scope choices before drilling into individual mechanics; discuss one challenge at a time when further discovery is needed. Treat new answers as provisional until confirmed and capture their implications and remaining decisions.

All three discovery rounds are complete: core simulation, 10 environment challenges, and 14 technical challenges (the original 10 plus four requested follow-ups). Old instructions in the historical log to pause, resume, or start a round are no longer active. Do not begin implementation automatically. The next development-planning stage requires the user's request; each later development prompt receives its own proposed detailed next step for review.

## 9. MVP acceptance criteria

The following are acceptance checks, not an implementation task list. Checks dependent on unresolved values need those values agreed before they can be signed off.

| Area | Observable pass condition |
|---|---|
| First visit | The deployed page loads a prepared checkpoint and starts a populated live world; its inherited population and chart history are available for observation. |
| Survival loop | Focused checks demonstrate reserve consumption, greater consumption from faster movement, eating/replenishment, starvation death, ageing, and reserve-gated asexual reproduction under the agreed life-cycle rules. |
| Shared food | Under the agreed consumption rules, agents cannot gain reserve from already-depleted/removed food; agents competing for a food item do not receive duplicate consumption beyond its available amount. Include stale-target behavior in focused checks. |
| Inheritance | Offspring inherit the selected traits, variation follows the agreed mutation rules, and selected traits have implemented benefits and costs. No brain or within-life learning is necessary. |
| Visible evolution | In an agreed reference scenario, charts and inspection demonstrate inherited diversity and an environment-favored trait trend over generations within the agreed observation window. The product goal is a couple of minutes; scenario, evidence, and repeat-run expectations remain to be agreed. A mature starting population alone does not demonstrate ongoing adaptation. |
| World | The world is bounded and non-wrapping; food placement includes clusters and sparse areas; agents remain outside rocks and water obstacles. Test movement and generated spawn positions. |
| Observation | Pan/zoom works; selecting an individual highlights it and shows inherited traits separately from current state. The default scene remains readable with optional overlays hidden. |
| Charts | Population and finalized trait charts update from collected data, reflect known births/deaths and trait samples in focused checks, and appear below the simulation experience. |
| Configuration and editing | All simulation parameters are inspectable through the GUI. Agreed initial settings affect newly generated worlds; settings indicate their live/restart effect. The agreed minimum interventions work in the current world, distinct from new-world configuration. |
| Time advancement | Fast-forward retains the normal simulation step size and reduces rendering frequency. Skipping a chosen number of steps advances exactly that many steps without rendering or real-time pacing. |
| Checkpoint round trip | Export/import preserves every living agent's inherited parameters and required metadata/history, while fresh positions and survival state replace all transient state. Statistics continue according to agreed history semantics. Unsupported versions and invalid imports are rejected before loading, with clear feedback. |
| Recipe reuse | An exported individual recipe can create an agent with the same inherited parameters in the current and a newly generated simulation, with fresh transient state. |
| Desktop scale | Run a representative world with roughly 1,000 living agents, charts, and individual inspection on the agreed desktop/browser. Meet the still-to-be-defined responsiveness/update-rate budget with the quadtree active. |
| Delivery and failures | The project runs over local HTTP and a repository-prefixed static URL without a backend, build, or Node.js. Required CDN libraries use pinned versions; a failed library load produces a clear error. |
| Validation | Focused core/save checks and manual browser checks cover the agreed behaviors, interactions, and diagnostics without a broad test framework. |

## 10. Open questions, assumptions, and risks

### Product and simulation decisions still open

- Final inherited traits, sensory model, ranges, trade-offs, inheritance/mutation, reproduction costs/cooldowns, death rules, and initial conditions.
- Decide which values are genes versus transient state, including reserve capacity and recognition ability if selected; define sensory inputs and how inspection reflects actual perception.
- Food capacity, spawn/regrowth/depletion, competition/ownership/removal, population/resource balance, and handling extinction or runaway population growth.
- Define birth/division, offspring count and placement, maturity, and how the first population survives long enough to evolve without prescribing the eventual result.
- Exact map defaults, special areas, obstacle/water presence and placement, and movement/avoidance rules.
- Minimum editable objects/properties, full control inventory, restart/reset behavior, and live-versus-new-world settings.
- Inspector fields, visual trait encodings, overlay choices, trait metrics, chart layout, and history retention.
- Checkpoint and recipe schemas, map regeneration, fresh-agent initialization, and history continuation across load/intervention.
- Reference conditions and evidence for visible adaptation; desktop/browser and measurable performance budget.

### Assumptions and risks

- **Stochastic outcomes:** diversity does not by itself prove adaptation. Balance and repeated observations will be needed; no guarantee of progress in every run is currently agreed.
- **Trait dominance:** poorly balanced costs may produce a universally best trait or early extinction instead of interesting trade-offs.
- **Shared-resource correctness:** stale references or duplicate consumption can create food from nothing and invalidate apparent survival/adaptation results.
- **Load discontinuities:** fresh reserves, ages, and positions can change selection pressures; preserved charts need an honest interpretation across loads.
- **Scale and time acceleration:** 1,000 agents plus charts, overlays, and high-speed stepping may exceed available compute. A quadtree helps spatial queries but is not a performance guarantee.
- **Unbounded history:** chart collection and saved statistics need a retention policy to avoid growing memory/files indefinitely.
- **World viability:** uneven food and blocked terrain may create unreachable resources or trapped agents; safe generation and movement need explicit rules.
- **CDN dependence:** deployment requires network access to third-party libraries; clear failure reporting is decided, offline support/fallback is not.
- **Scope growth:** detailed editing, diagnostics, and recipe workflows could expand disproportionately. Keep their first versions limited to agreed observation and reuse needs.

## 11. Future questions and retained project context

### Future evolution and ecosystem questions

These retain useful unanswered parts of the original vision without expanding the MVP:

- **Brain-based behavior:** decide later between fixed-topology networks, NEAT, other genetic optimization, gradient-descent learning, or combinations. No method is selected. If brains evolve, specify whether topology, weights, or both are inherited and mutated.
- **Within-life learning:** this differs from evolution across generations. If introduced later, decide how a brain changes during life and whether learned information is inherited; the MVP has no such learning.
- **Sexual reproduction:** define eligibility, mate recognition/compatibility, combination of parent traits and brain structures, mutation, and any species/cross-breeding rules before adding it. There is no agreed switch from asexual reproduction.
- **Predators:** distinct predator and prey species are the preferred future direction. The earlier unresolved idea of same-species predators with predator-only mating and no harm to one another is superseded, not a hidden constraint. Future prey targeting, mutual aggression, identity inheritance/recognition, and innate-versus-learned rules still need fresh decisions.
- **Additional needs and terrain:** water consumption, swimming, shelter, and any time-varying environment need separate scope and interaction decisions.
- **Observation and preservation:** camera-follow and any species-level save/reuse capability are future questions, not substitutes for current inspection and individual recipes.

The design should leave room for these directions without fixing their mechanics now or building speculative infrastructure.

### Useful lessons from other experiments

The original plan records the following context; it is reference material, not proof that this MVP's systems already exist:

- **Nature Simulator:** a quick ecosystem prototype demonstrating agents/grass, health loss and recovery, ageing, death, reproduction conditions/cooldowns, recurring grass, and population charts. Its notes propose evolving FOV, reproduction food thresholds, and speed, separating health from hunger, and more complete food/mate/enemy behavior. These are exploratory notes, not implemented evolution or a requirement to copy its model. Its shared-food-reference concern is retained in this specification's resource risk and acceptance checks.
- **Snake and car experiments:** examples of neural-network brains with genetic cycles.
- **Smart spaceship:** an example of genetic evolution without a conventional brain.
- **NN Visualization:** a neural network built from scratch, trained with gradient descent and visualized/tested to demonstrate learning.

These experiments can inform later choices but do not prescribe an algorithm, architecture, dependency, code-reuse decision, or implementation starting point. The older evolution simulation is deliberately excluded following the user's updated scope.

### Superseded decisions at a glance

| Earlier idea or preference | Current interpretation |
|---|---|
| Rich ecosystem with multiple survival resources and predator-prey relationships immediately | Keep a useful evolutionary foundation, but the MVP survival loop is food-only; predation, water needs, and shelter are deferred. |
| Distinct strategies as the primary evidence of evolution | Show inherited trait diversity and environmental suitability; shared behavior rules are acceptable. |
| Brain-led agents, possibly NEAT | Preset rules now, with a future replacement path; no brain algorithm selected. |
| Asexual division as a temporary early-generation bootstrap | Asexual reproduction is the MVP model throughout; no automatic transition is agreed. |
| Whole-world/exact-state or species saves | Lightweight evolution checkpoints plus individual recipes; no exact restoration or separate species-save requirement. |
| JSON as merely a suggestion | JSON files are the selected general save direction; recipe packaging and precise schemas remain open. |
| TypeScript; willingness to consider a lightweight build | Plain JavaScript and no Node.js at all take priority. Optional simple editor assistance is still possible. |
| Start simple and decide later whether spatial indexing is needed | Include indexing early; prefer a quadtree behind a shared interface. |
| Save only positions/velocities differently while other state was undecided | Reset all short-term state on load, including reserve, age, and cooldown. |
| Template might constrain the project | Use it as a guide; justified deviations are allowed while retaining style and main structure where practical. |

This consolidation retains substantive decisions, examples, unanswered design questions, and useful rationale. Repeated summaries, discovery scheduling messages, and obsolete instructions are not additional requirements.

## 12. Before development planning

Settle the minimum trait/life-cycle and sensing model, balancing approach, resource competition rules, and initial viability; define the reference evolution outcome; choose the smallest editing/control scope; resolve checkpoint/recipe and chart-history semantics; and establish default-world and desktop performance expectations. Detailed module boundaries, quadtree maintenance strategy, exact CDN versions/fallback policy, and diagnostic implementation choices can then be addressed in the agreed development plan. No implementation or detailed development plan is included here.
