# Train of Thought

Train of Thought is a playable p5.js railway-routing game. Trains travel automatically; switch junctions so each train reaches a station of its own color.

## Run the game

Open `index.html` through a local HTTP server, such as VS Code Live Server. The page uses relative project and portfolio paths and loads p5.js 1.4.0 and p5.sound 1.4.0 from cdnjs.

## Gameplay defaults

These values are defined in [`init.js`](./init.js):

| Default | Value |
| --- | --- |
| Board | 7 columns by 9 rows |
| Tile size | 60 logical pixels |
| Canvas | 420 by 540 logical pixels |
| Stations | 8 |
| Trains per round | 20 |
| Train interval | 150 animation frames |
| Train speed | 0.020 progress per frame |

The game has no editable settings. These code defaults remain the source of truth; the page does not add placeholder controls.

## Controls and actions

| Input | Effect |
| --- | --- |
| Click a junction | Switch its route between its two exits. Clicking ordinary track or station tiles does not switch a route. Junction clicks have no keyboard equivalent; dragging is not supported. |
| `G` / **Regenerate Board** | Try to generate a new board, reset score and train progress, and automatically start a new round. |
| `S` / **Restart Game** | Restart the round on the current board. Score and train progress reset; each junction keeps its current exit. |
| **Reset Everything** | Reset the round and restore each junction's starting exit on the current board. There are no editable settings to restore. |
| **Full Screen** | Toggle the whole game page into or out of full screen. |

`G` and `S` are ignored while a user is typing in or operating a native control. Trains start automatically, and the HUD shows score and the number of completed trains. Matching a train to its station adds 10 points; a wrong station ends that train without scoring. The game ends after all 20 trains finish.

## Board generation and recovery

Board generation makes at most 16 bounded attempts per request and checks legal placements before choosing one. If initial generation fails, the page shows an enabled **Retry Initialization** action while the game controls stay disabled. If a requested regeneration fails during a round, the current board and round are left intact; the visible status tells the player to try **Regenerate Board** again.

The earlier dead-end and repeated-regeneration reports are recorded in [`devlog.txt`](./devlog.txt#L8-L11). Regeneration now has a fixed attempt bound and replaces the active board only after a complete board is ready. The devlog's memory-leak explanation was explicitly a suspicion, not an established cause.

## Sound

The game uses the existing [`assets/`](./assets/) audio files for junction clicks, train rattling, matching-station horns, wrong-station alerts, and the finish sound. They are loaded once using the existing p5.sound version; the rattling track is no longer assigned a second time through `createAudio()`. Playback begins after a user gesture so a browser's autoplay policy does not prevent play. The game remains playable without sound.

## Project information

- The original [`devlog.txt`](./devlog.txt#L2-L4) proposes higher-visibility colors and illustrated stations, tunnels, and trains. Those are unconfirmed ideas rather than a committed roadmap; the current board and trains already use color-coded artwork.
- The same devlog says train sounds should be added, but the sound files and calls are present in [`utils.js`](./utils.js) and `assets/`; no duplicate sound feature is needed.
- [`tile.js`](./tile.js#L78-L82) records an unimplemented idea for parallel track lines that account for tile entry and exits. Tracks remain single-width.
- The original game notes link to [Lumosity's Train of Thought](https://www.lumosity.com/en/brain-games/train-of-thought/) as inspiration. This reference does not imply endorsement or affiliation.
