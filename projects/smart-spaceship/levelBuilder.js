// ezt még bőven szépíteni kellene, egy saját osztályt kellene hozzá létrehozni!
  // abban a pálya mentését is jó lenne kezelni
  // akár az összes pályával kapcsolatos részt kicsit össze lehetne dolgozni
  // pálya változók: obstacles, lifetime, canvas W/H

let mouseAction = 'waiting for first pos'
let firstPos;
let secondPos;

function mouseClicked() {
  if (DRAWMAPMODE) {
    if (!firstPos) {
      firstPos = createVector(mouseX, mouseY);
    } else if (!secondPos) {
      secondPos = createVector(mouseX, mouseY);
    }
  }
}


function doubleClicked() {
  level.removeObstacle(createVector(mouseX, mouseY));
}