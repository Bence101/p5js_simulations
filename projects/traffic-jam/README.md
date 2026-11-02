# Traffic Jam Simulator

A standalone p5.js traffic simulation. Open this project through a local HTTP server or its GitHub Pages URL; it uses the shared [project shell](../../assets/js/project-shell.js), [stylesheet](../../assets/css/style.css), and [page controller](../../assets/js/project-page.js). The project bundles and loads one local copy of p5.js 1.4.1.

## Simulation defaults

- Logical canvas: 800×600 pixels, displayed at a starting scale of 3 pixels per metre.
- Road: 10 lanes, 3.7 metres per lane (37 metres across), and 300 metres long.
- Initial population: the simulator attempts to place 120 vehicles, with at most 1,000 placement attempts. Safe-distance rejection means the actual starting count can be lower.
- Initial vehicle speeds are randomized between 10 and 25 m/s. New vehicles are attempted at a random interval of 1–3 seconds.
- Each vehicle has a 20% chance of being a truck. Cars are 4 m long and 1.8 m wide, accelerate at up to 3 m/s², decelerate at up to 10 m/s², and have a desired speed of 20 m/s. Trucks are 12 m long and 2.5 m wide, accelerate at up to 2 m/s², decelerate at up to 6 m/s², and have a desired speed of 15 m/s.
- Vehicle placement uses a 10 m safety allowance in addition to the half-lengths of the vehicles being compared.

Vehicles accelerate toward their desired speed when there is no vehicle ahead in the same lane. When following too closely, they decelerate according to the simulated gap. Lane-changing behavior is not implemented.

## Controls and readouts

- Use the mouse wheel over the canvas to zoom around the pointer.
- Left-click the road to attempt to add a car or truck; the safe-distance overlap check may reject it.
- To pan, start a left-button drag off the road inside the canvas. A drag that starts on the road does not pan.
- The Vehicles on road readout shows the current population.
- The Detected collision pairs readout increments for every detected overlapping same-lane vehicle pair. It counts pairs, not individual vehicles or collision events. Vehicles in a detected pair stop, receive a red outline, and are removed after about two seconds.
- There are no adjustable simulation settings and no custom keyboard shortcuts.

**Restart Simulation** creates a fresh vehicle population and resets the collision-pair counter while retaining the current camera pan and zoom. **Reset Everything** also restores the initial camera position and 3 px/m zoom. Neither action reloads the page.

## Project information

The original source contains one future idea: implement lane-changing behavior. It remains unimplemented; the note is retained in [vehicle.js](./vehicle.js).
