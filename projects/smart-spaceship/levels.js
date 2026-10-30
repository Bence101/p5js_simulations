

function createEmptyLevel() {
  let level = new Level(500);
  return level
}

function createAdvancedLevel() {
  let level = new Level(500);
  let obstacleWidth=150;
  let obstacleHeight=25;
  // level.addObstacle(100, 100, obstacleWidth, obstacleHeight);
  level.addObstacle(0, 200, 150, 175);
  level.addObstacle(275, 200, 400, obstacleHeight);
  
  level.addObstacle(0, 350, 325, obstacleHeight);
  level.addObstacle(425, 200, 200, 175);
  
  return level
}

function createAdvancedMap_0() {
  let level = new Level(500);
  let obstacleWidth=150;
  let obstacleHeight=25;
  // level.addObstacle(100, 100, obstacleWidth, obstacleHeight);
  level.addObstacle(0, 200, 150, 175);
  level.addObstacle(275, 200, 400, obstacleHeight);
  
  level.addObstacle(0, 350, 325, obstacleHeight);
  level.addObstacle(425, 200, 200, 175);
  
  return level
}



function createBaseMap() {
  let level = new Level(400);
  let obstacleWidth=150;
  let obstacleHeight=25;
  // level.addObstacle(100, 100, obstacleWidth, obstacleHeight);
  level.addObstacle(0, 200, 200, obstacleHeight);
  level.addObstacle(300, 200, 400, obstacleHeight);
  
  level.addObstacle(0, 350, 400, obstacleHeight);
  level.addObstacle(500, 350, 100, obstacleHeight);
  
  return level
}