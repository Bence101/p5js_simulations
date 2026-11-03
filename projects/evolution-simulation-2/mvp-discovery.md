# Evolution Simulation 2 — MVP Discovery Log

## Purpose

Use this log to clarify a feature-focused MVP through a sequence of small, high-impact decisions. The MVP should be a foundation for future ideas, not a throwaway prototype.

## Working agreement

- Discuss one challenge at a time.
- Resolve broad product and scope choices before detailing individual behaviors or mechanics.
- Record answers as provisional until explicitly confirmed.
- After each answer, capture implications and choose the next unresolved decision.
- Keep technical implementation details out of scope for this discovery.

## Current working brief

- The user wants to see some agents show clear signs of evolution within a couple of minutes.
- The user selected distinct strategies emerging as the most interesting evidence of evolution.
- The MVP should have preset behavior rules, with future room for a brain-based behavior system.
- Evolving physical and sensory traits are currently the focus; asexual reproduction is preferred for the MVP.
- Sexual reproduction and shelter are future ideas.
- Food is currently envisioned as the central system, connecting survival, movement costs, and reproduction.
- A possible strategy mentioned was avoiding clusters of the species while seeking abundant food. This is exploratory, not a requirement.

## Discovery record

### Challenge 1 — What should the MVP demonstrate?

**Answer:** Within a couple of minutes, some agents should show clear signs of evolving.

**Status:** Provisional; the phrase “clear signs” needs a feature-level definition.

### Challenge 2 — What counts as evidence of evolution?

**Answer:** Distinct strategies emerge.

**Status:** Provisional.

### Challenge 3 — What strategies might be interesting?

**Answer:** An agent might avoid clusters of its species and choose the most abundant area to feed.

**Status:** Exploratory example only. Do not treat as a decided feature or continue refining it until broader scope is agreed.

### Process correction — Keep challenges at the right level

**User feedback:** The discussion became too focused on the strategy and too micro at this stage.

**Adjustment:** Return to high-level MVP scope and priorities. Do not resolve the detailed strategy contrast yet.

### Challenge 4 — What is the broad scope of the first version?

**Answer:** A rich ecosystem from the start.

**Status:** Direction chosen; the essential parts of “rich ecosystem” still need prioritizing.

### Challenge 6 — Which ecosystem features are non-negotiable?

**Answer:** Multiple needs/resources and predator-prey relationships.

**Status:** Chosen as first-version priorities. Their detailed mechanics remain open.

### Challenge 7 — How should predators and prey relate?

**Answer:** The user prefers distinct predator and prey species, but is concerned that this may be the hardest option.

**Status:** Preference recorded; MVP scope trade-off remains unresolved.

### Challenge 8 — How much predator/prey scope belongs in the MVP?

**Answer:** Defer predation; revisit it as a later expansion.

**Status:** MVP scope choice. The preferred distinct-species model remains a future direction, not a first-version requirement.

### Challenge 9 — What survival needs/resources are in the initial ecosystem?

**Answer:** Food and water are in the first version. Shelter is an appealing later addition.

**Status:** MVP scope choice for the initial needs; shelter recorded for future expansion.

### Challenge 10 — What causes strategies to change?

**Answer:** Evolution across generations; within-life learning is not needed for the MVP.

**Status:** Chosen direction.

### Challenge 11 — What evolves in the MVP?

**Answer:** The MVP should focus on physical and sensory traits such as speed, size, and reproduction rate. Behavior should initially follow given rules, such as seeking food when hungry and reproducing when eligible. Asexual reproduction is preferred for the MVP. The design should allow brain-based behavior and sexual reproduction as later expansions.

**Status:** Chosen direction, subject to aligning the visible success criterion.

### Challenge 12 — What counts as visible evolution?

**Answer:** Both inherited trait diversity and traits becoming better suited to the world.

**Status:** Chosen direction. This refines the earlier interest in distinct strategies: behavior can follow shared rules while traits and outcomes differ.

### Challenge 13 — Which inherited traits are the MVP's starting set?

**Answer:** The user proposed movement speed, body size, reproduction rate, and lifespan as a good start, with sensory range versus field of view as another possible trade-off. Traits should have counterbalancing benefits and costs. Examples proposed: faster movement consumes more food; larger/slower creatures may store more food; higher reproductive rate may require more food (through offspring number or shorter cooldown); longer lifespan may allow later reproduction; and sensing could trade narrow/far vision against wide/shorter vision.

The user wants these trade-offs worked out during MVP planning rather than treating traits as isolated bonuses.

**Status:** Candidate trait set and design principle recorded; exact trait list and balance remain open.

### Additional feature notes from Challenge 13

- Food is proposed as an individual reserve with a starting value around 50, death near 0, and reproduction eligibility around 80–90. These values are examples, not final decisions.
- The reserve should decrease gradually, with faster movement consuming it faster. Eating environmental food would replenish it.
- The food reserve is intended to connect survival and reproduction; larger creatures may hold more.
- Environmental food should be clustered rather than uniformly scattered.
- Traits should be monitored over the course of the simulation; the monitoring experience is not yet designed.

### Challenge 14 — What role should water have in the first version?

**Answer:** Defer water as a survival resource. Water may still appear as an environmental obstacle alongside rocks. In a later phase, water could become swimmable and serve as a resource.

**Status:** MVP scope choice; water-as-resource and swimming are future additions.

### Remaining discussion limit

The user requested only two more challenges before the MVP is synthesized. Both have been completed.

## Decisions not yet made

- How population growth, death, resource limits, and the candidate trait trade-offs should be refined during subsequent MVP planning.
- How trait changes and adaptation should be monitored and communicated.

## Next step

Synthesize the decisions above into a feature-level MVP statement, then refine the remaining balancing and monitoring questions in future planning.

## Working MVP synthesis

Build a continuous ecosystem simulation where one population follows a clear, preset survival rule set and evolves inherited physical/sensory traits across asexual generations. The initial ecological loop is centered on food: agents consume a personal food reserve over time, movement affects consumption, eating replenishes it, low reserves lead to death, and high reserves permit reproduction. Clustered environmental food creates uneven opportunities. Within a couple of minutes, the observer should be able to see inherited trait diversity and signs that traits better suited to the world are becoming more common.

Candidate inherited traits include movement speed, body size, reproduction rate, and lifespan. Sensory range versus field of view is another candidate. Traits should have meaningful counter-trade-offs rather than isolated benefits. Food-reserve thresholds and all proposed numbers remain examples to refine, not fixed specifications.

Water is not a survival need in the MVP. Rocks and water may be environmental obstacles; swimming and water as a resource are later expansions. Predation, a distinct predator species, shelter, brain-based behavior, and sexual reproduction are also later directions. The rules-based behavior should be designed so brain-based behavior can replace it in a future version.

Trait monitoring is important to the experience, but its presentation is still open. Population growth/death balance, exact trait trade-offs, and the food/reproduction thresholds also remain to be designed.
