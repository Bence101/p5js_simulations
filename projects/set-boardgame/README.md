# Set Boardgame

A standalone p5.js card game and solver. The board contains 12 randomly generated cards. Select three cards whose color, shading, and symbol pattern are each either all the same or all different. Use **Find a Set** to have the solver search the current board and outline one valid trio.

Open [index.html](./index.html) through a local static HTTP server. The page uses the shared [project shell](../../assets/js/project-shell.js), [page controller](../../assets/js/project-page.js), and [stylesheet](../../assets/css/style.css). The sketch remains in this folder.

## Dependencies and board

The page uses p5.js 1.6.0 and its sound add-on from the same CDN URLs as the original page. The game does not use sound features. Its fixed logical canvas is 560 x 420 pixels, with 12 cards arranged in four columns and three rows. Each card is generated independently, so duplicate cards are possible.

The three game attributes are color, shading (outline, solid, or pale), and symbol pattern. The symbol pattern combines the symbol shape and number of symbols as one value. A valid trio has all three values the same or all three values different for each attribute.

## Controls

| Action | Behavior |
| --- | --- |
| Click a card | Select or deselect it. The game confirms and clears a valid trio automatically. |
| Find a Set | Searches all trios on the current board and outlines the first valid one in green. If none exists, the status recommends a new board. |
| Restart Game | Deals 12 new random cards and clears selections and solver highlights. |
| Reset Everything | Restarts the board; there are no editable settings. |

There are no custom keyboard shortcuts. The solver and shared game buttons are keyboard-operable, but selecting cards on the canvas requires a mouse and has no keyboard equivalent.

The original project folder contains no planning notes or documented future work, so the shared Project Information area leaves Next Steps marked as empty.

[Project source on GitHub](https://github.com/Bence101/p5js_simulations/tree/main/projects/set-boardgame)
