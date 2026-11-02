class InnerHud {
  constructor(simulation) {
    this.simulation = simulation;
    this.infoTable = new InfoTable(createVector(0,0), []);

  }
  
  update() {
    let infoList = [
                    {'name': 'FPS', 'value':   Math.round(frameRate())},
                    {'name': 'simStep', 'value': this.simulation.simStep}
                    ]
    this.infoTable.update(createVector(0,0), infoList);
  }
  
  display() {
    this.infoTable.display()
  }
  
}





class UserInputController {
  constructor() {
    this.mouseMode = 'boardManipulation'
  }
  
  display() {
    return undefined
  }
  
  mousePressed() {
    if (this.mouseMode == 'boardManipulation') {
      boardManipulator.startNewObstacle(mouseX, mouseY, mouseButton)
    }
  }
                         

  mouseReleased() {
    if (this.mouseMode == 'boardManipulation') {
      boardManipulator.endNewObstacle(mouseX, mouseY, mouseButton)
    }
  }
  
  doubleClicked() {
    if (this.mouseMode == 'boardManipulation') {
      boardManipulator.removeObstacle(mouseX, mouseY, mouseButton)
    }
  }
  
  mouseDragged() {return undefined}
}
    