
function setup() {
  canvas = createCanvas(SETTINGS.general.canvasWidth, SETTINGS.general.canvasHeight);
  
  testParagraph = createP("") // törölni
  testParagraph.style('color', '#777777')
  testParagraph.style('white-space', 'pre-line')

  
  simulation = new Simulation(SETTINGS);
  HUD = new InnerHud(simulation);
  
  ViewTransformer.restore(viewTransformerControls, SETTINGS, true);
}


function draw() {
  // background(color(220,220,220, 10));
  background(color(200,200,200));
  
  stroke(color(200));
  // testParagraph.html(JSON.stringify(viewTransformerControls, null, 2))
  testParagraph.html("KeyLayout: \n" + JSON.stringify(SETTINGS.keyLayout, null, 2))
  
  
  // fastForward logic #1/2
  let skippedFrame=SETTINGS.fastForwardFrameAmount;
  if (SETTINGS.fastForward) {skippedFrame=0; SETTINGS.fastForward=0}

  for (let i=0; i<SETTINGS.simSpeed; i++) {
    simulation.update();
    HUD.update();
    
    // fastForward logic #2/2
    if (skippedFrame<SETTINGS.fastForwardFrameAmount) {
      skippedFrame++;
      i--;
    } 
  }

  
  push();
    // scaled and panned draw
    scale(viewTransformerControls.view.zoom);
    translate(viewTransformerControls.view.x, viewTransformerControls.view.y);
    simulation.display();
  pop();
  
  // non scaled and non panned draw
  HUD.display();
  boardManipulator.display(mouseX, mouseY);
  testDraw();
  testControl()
}


function testControl() {
  if (keyIsDown(LEFT_ARROW)) {
    simulation.creatures[0].mover.directSteering(-1)
  }
  if (keyIsDown(RIGHT_ARROW)) {
    simulation.creatures[0].mover.directSteering(1)
  }
  if (keyIsDown(UP_ARROW)) {
    simulation.creatures[0].mover.directSpeedChange(1)
  }
  if (keyIsDown(DOWN_ARROW)) {
    simulation.creatures[0].mover.directSpeedChange(-1)
  }
  if (keyIsDown(81)) {
    print(0)
    simulation.creatures[0].mover.vel.setMag(0)
  }
}

function testDraw() {
  // for (let obstacle of simulation.board.obstacles) {
  //   if (obstacle.onIt(createVector(mouseX, mouseY))) {
  //     circle(mouseX, mouseY, 10)
  //   }
  // }
}




