# Neural Network Visualization

This p5.js simulation trains a fully connected neural network to classify one of three two-dimensional data sets. The canvas places the predicted decision surface beside the network graph and reports the frame rate, learning iterations, and training-set accuracy.

## How to Use

- Open `index.html` through the portfolio or a local HTTP server.
- Select **Double spiral**, **Same-sign quadrants**, or **Circle (radius 5)** to choose the classification problem.
- Set up to five hidden layers with the number fields; enter 0 to omit a layer.
- Use **Training updates per frame** and **Learning rate** to tune training, and set **Pause at accuracy** to pause automatically when the selected percentage is reached.
- Choose **Apply immediately** or switch to **Apply after restart**. The second mode holds edits until you choose **Restart Simulation**.
- Choose **Resume Training** after an accuracy pause to continue the current network. Choose **Restart Simulation** for a fresh random network, or **Reset Everything** to restore the page defaults.
- There are no custom keyboard shortcuts or canvas mouse controls. Use Tab to move through controls, arrow keys to adjust sliders, and Enter or Space to activate buttons.

## Default experiment

- Dataset: 1,000 random training examples are generated once when the page loads and labeled by `DataSetGenerator.flagSplitter`; the default is Same-sign quadrants.
- Network architecture: `[2, 8, 8, 1]`; the two input nodes and one output node are determined by the selected problem.
- Data scale: `[-10, 10, -10, 10]`.
- Decision-grid dimensions: `[30, 30]`; the generator samples 60 positions per axis, producing a 60-by-60 grid over the data scale.
- Training: 100 updates per animation frame by default, with one randomly selected training example per update.
- Learning rate: `0.01`.
- Automatic pause threshold: `95%`.
- Logical canvas size: 820 × 600 pixels.
- Readouts: FPS, cumulative learning iterations (individual training updates), and accuracy on the generated training set (rounded to two decimal places, as a value from 0 to 1).

The `projectDefaults` object in [sketch.js](./sketch.js) is the source of truth for the logical canvas size and control defaults. `ProjectPage.connect()` applies its `controls` values to the native controls and their reset defaults before the first settings read. HTML supplies the control structure and constraints, not initial values.

## Controls and reset behavior

| Control | Type and range | Default | Application |
| --- | --- | --- | --- |
| Setting application | Switch: immediate or after restart | Immediate | Applies to all settings below the switch |
| Dataset | Radio: same-sign quadrants, double spiral, or circle | Same-sign quadrants | Immediate mode regenerates the data and grid and creates a fresh network; staged in after-restart mode |
| Training updates per frame | Range, 1–500, step 1 | 100 | Live in immediate mode; staged in after-restart mode |
| Learning rate | Range, 0.001–0.1, step 0.001 | 0.01 | Live in immediate mode; staged in after-restart mode |
| Hidden layers 1–5 | Number, 0–9, step 1; zero omits a layer | 8, 8, 0, 0, 0 | Immediate mode creates a fresh network; staged in after-restart mode |
| Pause at accuracy | Number, 1–100 percent, step 1 | 95% | Live in immediate mode; staged in after-restart mode |

In **Apply immediately** mode, changing the training-update count, learning rate, or accuracy threshold affects the running simulation without resetting it. Changing the dataset generates a new data set and decision grid and initializes a fresh network; changing the hidden-layer architecture initializes a fresh network while retaining the current data and grid. Both structural changes reset the learning-iteration count.

In **Apply after restart** mode, edits to the dataset, training settings, architecture, and accuracy threshold are held until **Restart Simulation**. Restart applies the displayed settings, creates a fresh randomly initialized network, and resets the learning-iteration count. A restart with the same selected dataset retains the current generated data and grid; a newly selected dataset generates fresh data and a grid. Restart does not change control values.

The accuracy threshold compares the training accuracy with the entered percentage (for example, `0.95` accuracy reaches a `95%` threshold). When the threshold is reached, the sketch stops its animation loop. **Resume Training** continues with the current network; automatic pausing can trigger again after accuracy falls below and then reaches the threshold. A restart creates a fresh network and resumes training, though it can pause again as soon as the new run reaches the threshold.

**Reset Everything** and a direct native form reset restore the sketch-defined defaults, including immediate-apply mode, the same-sign-quadrants dataset, the default architecture and training values, and the 95% threshold. The shared controller synchronizes slider outputs and restarts the simulation with a fresh network.

## Canvas sizing and layout

The logical canvas defaults to 820 × 600 pixels, set by `projectDefaults.canvas` in [sketch.js](./sketch.js) and passed to `createCanvas()`. Its p5 renderer is passed as `canvas` to `ProjectPage.connect()`, which derives the host's maximum width and aspect ratio from the logical dimensions, independently of pixel density. Change the sketch's canvas defaults to change the size and ratio; no HTML sizing values need updating.

It displays the decision surface on the left and the network graph on the right, with readouts above them. Those positions and sizes are fixed in the sketch and do not automatically rearrange when canvas dimensions change. The shared project stylesheet displays the canvas at its natural logical size when space permits and uniformly scales it down, never up, to fit narrower containers; the sketch coordinates and canvas dimensions are not resized for viewport changes. Project-specific CSS only constrains the settings layout and range-control width.

## Dependencies

- p5.js 1.4.0, loaded from cdnjs.
- math.js 10.6.1, loaded from cdnjs for matrix operations and rounding.

The original page also included p5.sound, but the simulation does not use sound APIs, so it is not loaded. The local copies of p5.js and math.js remain in the project folder but are not loaded; the page uses the two pinned CDN versions above.

## Interaction inventory

The simulation has no custom canvas mouse controls, keyboard handlers, or keyboard shortcuts. Native page controls include one apply-mode switch, three dataset radio buttons, five hidden-layer number fields, two range sliders with outputs, an accuracy-threshold number field, and **Resume Training**. The shared project controller provides **Restart Simulation** and **Reset Everything**.

## Unimplemented source notes

The original notes list possible future work: a batch gradient-descent alternative ([`todo.txt`, line 7](./todo.txt#L7)), genetic-algorithm options such as mutation ([`todo.txt`, line 8](./todo.txt#L8)), and applying this network to a small-car simulation ([`todo.txt`, line 18](./todo.txt#L18)). When the network is ready, the notes propose an XOR visualization, then a two-class canvas-drawing experiment that varies network settings, retrains to see whether the groups are separated, and retains the network visualization. Possible training samples include canvas coordinates with their colors or the drawn points ([`todo.txt`, lines 9–17](./todo.txt#L9-L17)). These are unimplemented ideas, not controls or features in this page. The source notes also mark an earlier mouse-driven random-network idea as abandoned ([`todo.txt`, lines 3–5](./todo.txt#L3-L5)).

In the code, the visualizer contains notes about copying network data and handling activation min/max values ([`neuralNetworkVisual.js`, lines 16–21](./neuralNetworkVisual.js#L16-L21)). Other unimplemented design notes propose separating feed-forward work from `predict()` and extracting error calculations into a separate class ([`neuralNetwork.js`, line 15](./neuralNetwork.js#L15); [lines 133–144](./neuralNetwork.js#L133-L144)). `getNNData()` is marked untested and `NeuralNetwork.copy()` remains unfinished ([`neuralNetwork.js`, lines 157–170](./neuralNetwork.js#L157-L170)).
