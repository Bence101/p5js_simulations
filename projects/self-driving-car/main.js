
currentGen = 0;

function setup() {
  createCanvas(800, 600);
  track = new Track(createVector(0, 0), trackPicture, checkpointList);
  testText = createP('test');
  START_POINT = createVector(start[0], start[1]);
  population = new Population(popSize, 200);
  trackBuilder = new TrackBuilder();
}


function draw() {
  background(220);
  
  for (let i = 0; i < simSpeed; i++) {
    testText.html(currentGen + ' ' + population.age);
    // updating population (e.g. moving agents based on their genes)
    population.update(track);
    
    // checking for the end of a population
      
    if ((!population.hasAlive) || (population.age>=maxSimLength)) {
      population.calculateFitnesses();
      // print(population.maxScore, currentGen, population.maxFitness)

      // creating new population from the previous generation
      population = new Population(popSize, 200, population);
            
      currentGen++;
      if (currentGen>=GENERATIONS) {
        // currently this ends the simulation (with error)
          // but later a restart button will handle this
        print('The simulation finished!')
        noLoop();
        break;
      }      
    }
    
    // this freezes the loop until desired generation is not reached
    if (currentGen<SKIPNGEN) {
      i-=1;
    }
  }
  
  
  track.display();
  population.display();
  trackBuilder.display();
}

// function mousePressed() {
//   trackBuilder.addNode(createVector(mouseX, mouseY));
// }


function preload() {
  // preload() runs once
  carPicture = loadImage('redcar.png');
  trackPicture = loadImage('track_1.png');
}