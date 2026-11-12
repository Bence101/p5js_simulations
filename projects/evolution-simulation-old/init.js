let canvas;
let simulation;
let HUD;
let SETTINGS = {};
let initialSettings;
let userInputController = new UserInputController();
let boardManipulator = new BoardManipulator();

function preload() {
  SETTINGS = loadJSON('./settings.json');
}


let viewTransformerControls = {
  view: { x: 0, y: 0, zoom: 1 },
  viewPos: { prevX: null, prevY: null, isDragging: false },
};


window.mousePressed = (e) => (ViewTransformer.move(viewTransformerControls, 
                                                  SETTINGS).mousePressed(e),
                              userInputController.mousePressed()
                             )
window.mouseDragged = (e) => (ViewTransformer.move(viewTransformerControls, 
                                                 SETTINGS).mouseDragged(e),
                              userInputController.mouseDragged()
                             )
window.mouseReleased = (e) => (ViewTransformer.move(viewTransformerControls, 
                                                  SETTINGS).mouseReleased(e),
                               userInputController.mouseReleased()
                               )
window.keyPressed = (e) => (ViewTransformer.restore(viewTransformerControls, SETTINGS),
                            ViewTransformer.fullScreen(viewTransformerControls, SETTINGS),
                            Utils.simSpeedControl(SETTINGS),
                            Utils.saveBoard(SETTINGS)
                           )
window.mouseWheel = (e) => ViewTransformer.zoom(viewTransformerControls, SETTINGS).worldZoom(e) // valamiért eredetileg a mouseWheel event listener a canvason volt meghívva az eredeti példában

window.doubleClicked = (e) => userInputController.doubleClicked()
