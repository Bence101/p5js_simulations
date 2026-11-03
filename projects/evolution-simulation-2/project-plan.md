# Evolution Simulation 2 — Project Plan

## 1. Vision

Build a continuous, observable ecosystem simulation in which the main subject is a population of individual agents. Each agent has inherited physical traits, senses, and a neural-network-based behavior system. Agents act in a changing environment, survive or die according to their needs and interactions, and pass modified traits and brains to offspring.

The simulation should make it possible to see and understand why agents behave differently, inspect an individual, and save and resume a simulation or preserve a species.

## 2. Intended experience and priorities

1. **Agents and learning are the focus.** The environment exists to create meaningful problems and selection pressures for agents; it is not the main attraction.
2. **Differences should be visible and explainable.** An observer should be able to distinguish capabilities such as sensing food and examine the traits, senses, and behavior of a selected agent.
3. **The simulation runs continuously.** Agents perceive and act over time rather than taking discrete turns.
4. **Keep the graphics representative and legible.** Visuals should communicate agents, resources, threats, and relevant capabilities without requiring elaborate art.
5. **Support large populations.** The target is to render around 1,000 agents at once. This is a performance goal, not a confirmed limit or benchmark.
6. **Preserve and inspect outcomes.** Provide a save system for a whole simulation and/or species; the exact scope and format remain open.

## 3. Environment and entities

The intended environment may contain:

- Obstacles and board boundaries.
- Grass-like food and water.
- Agents, including potential predators.

The environment should offer survival and navigation challenges that give agents something to sense and respond to. The exact world size, resource behavior, obstacle types, and whether the environment changes over time have not been decided.

## 4. Agent model

### Individual traits

Every individual should be capable of differing from others, including individuals of the same species. Candidate inherited or evolving base traits from the project vision are:

- Size.
- Energy level or energy capacity.
- Age or lifespan.
- Reproduction rate.
- Sight range and field of view.
- Ability to recognize relevant entities.

These are a starting list, not a finalized genome. It remains to decide which values are genes, which are current state (for example, current energy and age), and what ranges, costs, or trade-offs apply.

### Needs and life cycle

Food, energy/health, ageing, survival, and reproduction are intended to matter to an agent's life cycle. The Nature Simulator already prototypes health loss, eating grass to regain health, age, reproduction cooldowns, and death. Its notes also identify health and hunger as concepts that may need separating.

The final model must define how these systems relate: for example, whether hunger is a drive, energy is a resource, health is damage tolerance, or some combination. No specific equations or thresholds have been selected.

### Senses and recognition

Agents are intended to have sensors that let them:

- See nearby entities within a range and viewing cone.
- Recognize categories such as food, water, predators, mates, and members of their own species.
- Differ in sensing range, cone, and recognition ability.

The old obstacle-avoidance prototype has a single forward ray used for obstacle detection; its field-of-view arc is visual only and does not affect perception. Its original notes proposed expanding to 5–7 rays. That is useful prior work for navigation, but the final sensor design could be richer and is undecided. In particular, it is not yet specified whether agents receive ray distances, entity categories, or other structured inputs.

### Behavior, learning, and evolution

The intended behavior system is a neural-network-based brain, with NEAT mentioned as a possibility rather than a settled choice. Example intended behavior: an agent recognizes food and moves toward it.

Keep these concepts distinct when defining the system:

- **Within-life learning:** whether an agent's brain can change during its lifetime, and if so how.
- **Evolution across generations:** how traits and brains are inherited, selected, crossed, and mutated.

The project vision clearly calls for evolving behavior and traits, but does not yet settle whether agents also learn during their own lifetime, or whether the brain changes only through evolution.

## 5. Reproduction, inheritance, and population

The long-term direction includes reproduction, cross-breeding, and mutation. A complete design needs to specify:

- What makes an agent eligible to reproduce and what reproduction costs.
- Whether reproduction requires a mate, and how mate recognition and compatibility work.
- How parent traits and brain structures are combined.
- Which traits or brain components can mutate, and how large or frequent mutations may be.
- How species identity is defined and how it relates to compatibility.

### Early-generation bootstrap — unresolved

The concern is that agents with no useful behavior may fail to find resources and die before evolution can discover useful behavior. A proposed aid is to let early generations reproduce asexually by division, then eventually rely on another form of reproduction.

This is a proposal, not a chosen rule. The transition condition, whether asexual reproduction is temporary or always possible, and how it avoids bypassing the intended evolutionary challenge remain open. Other possible approaches—such as simpler starting behaviors, easier early conditions, or staged environments—have not been assessed here.

## 6. Predator and species model — contradiction to resolve

The stated goals say both:

- There should be **one species**, with differences between individuals.
- Predators should be the **same species**, evolve to eat members of their own species, mate only with predators, and not harm one another.

These statements leave the classification unclear. “Predator” could mean an inherited role or phenotype within one species, a distinct subpopulation, or a separate species. The design must also reconcile predators eating their own species with predators never harming each other. In particular, it is unclear whether predators only eat non-predator members, whether “not harm each other” applies only to attacks and not other interactions, and how predator identity is inherited or recognized.

**No interpretation is selected in this plan.** Decide whether predator status is a trait/role or species identity, who can be prey, how predator-only mating is enforced, and whether this rule is innate or learned.

## 7. Continuous simulation and presentation

The simulation is intended to run continuously, with agents sensing, deciding, moving, consuming resources, and interacting over time. It is not intended to use turn-based actions.

Visuals should remain simple but communicate enough to make behavior understandable. Useful presentation goals include:

- Distinguish agents or mark capabilities such as being able to detect food.
- Show relevant senses or targets when useful for explanation or debugging.
- Select and examine any individual agent, including its traits, sensory capabilities, and behavior-related information.
- Keep any diagnostic visuals readable without making them necessary for normal use.

The visual encoding, inspection interface, and controls for pausing, speed, and diagnostics have not been specified.

## 8. Saving and loading

The desired save system may support:

- Saving and restoring the complete simulation, including its world and population.
- Saving and reusing a species or its inherited definition.

It is not yet decided whether both are required, what data a species save contains, how save compatibility across future versions is handled, or whether saves are local files, browser storage, or another format.

## 9. Related project work and what it contributes

### Evolution Simulation (the obstacle-avoidance prototype)

This project is a reasonable **conceptual and code starting point for the environment/navigation layer**, not a finished evolution framework. It currently provides a bounded board, rectangular obstacles, creature movement, one-ray obstacle detection, avoidance, and board interaction. It does not implement population selection, reproduction, inheritance, mutation, NEAT, learning, or fitness.

Its original notes proposed 5–7 sensing rays, a genetic-algorithm system with population/selection/crossover, and a compatible NEAT component. They also recorded obstacle-avoidance limitations and possible future obstacle types. See [the prototype README](../evolution-simulation/README.md) and [its original TODO notes](../evolution-simulation/__ToDO.txt).

**Recommendation:** start from this project for the continuity of the world and navigation experiment, but do not assume its current architecture or obstacle-avoidance code should dictate the design of the agent, genome, brain, or population system. First decide the feature model in this document; then assess which parts of the old code are worth retaining.

### Nature Simulator

This project is a quick prototype for ecosystem mechanics. It already demonstrates agents and grass, health loss and recovery, ageing, death, reproduction conditions, recurring grass, and population charting. Its original notes proposed evolving field of view, food thresholds for reproduction, and speed across generations, as well as separating health from hunger and adding more complete food, mate, and enemy behavior. These are exploratory notes, not implemented evolution. See [the Nature Simulator README](../nature-simulation/README.md), [its sketch and original notes](../nature-simulation/sketch.js), and [its agent implementation](../nature-simulation/agent.js).

**Recommendation:** use it as a reference for desired survival and population mechanics, not as evidence that those mechanics are already complete or that its prototype implementation must be carried over. Its notes also mention a case where multiple agents may retain a reference to grass after it has been eaten; resource ownership/removal deserves explicit design.

### Other evolution and learning experiments

Based on the project history described for this plan:

- The snake and car projects explore neural-network brains with genetic cycles.
- Smart spaceship explores genetic evolution without a conventional brain.
- NN Visualization demonstrates a neural network built from scratch and trained using gradient descent, with visualization/testing as proof that it can learn.

These experiments provide alternative approaches to learn from. They do not determine whether this simulation should use a fixed-topology neural network, NEAT, gradient-descent learning, genetic optimization, or a combination. That choice should follow the desired learning and inheritance model rather than be assumed from any one earlier project.

## 10. Explicit open questions

These are deliberate questions, not decisions hidden in the plan:

1. Is predator a role/phenotype within one species, a subpopulation, or a separate species? Which individuals can predators eat, and what exactly does “predators do not harm each other” mean?
2. Is reproduction sexual, asexual, or both? If early asexual division is used, when and how does the transition happen?
3. What is inherited: physical traits, sensory traits, brain topology, brain weights, or all of these?
4. Is learning allowed within an individual's lifetime, or does behavior change only between generations? If both, how is learned information inherited, if at all?
5. Is NEAT the preferred brain/evolution method, or should the project combine or compare approaches from the prior experiments?
6. How are species identity, mate compatibility, and cross-breeding defined?
7. How do food, water, energy, hunger, health, age, and reproduction interact?
8. What are the initial conditions and survival pressures that give the first population a viable chance without predetermining the outcome?
9. Which world features are essential for the first usable simulation, and which—such as predators, water, moving obstacles, or a changing environment—can be added later?
10. What information should individual inspection expose, and how should sensing/recognition capabilities be visualized?
11. What does the target of 1,000 visible agents require in practice (device/browser target, update rate, and acceptable visual detail)?
12. What exactly should whole-simulation and species saves contain, and how should they be stored and versioned?

## 11. Scope boundary

This document organizes the intended design; it does not prescribe a final architecture, neural-network algorithm, genome schema, balancing model, visual style, or implementation sequence. Those should be decided after resolving the high-impact questions above. The existing prototypes are references and potential sources of reusable work, not commitments to preserve every implementation detail.