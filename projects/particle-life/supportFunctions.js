

function regenerateMatrix() {
  connectionStrengthMatrix = createMatrix(nGroups);
  createMatrixButtons(connectionStrengthMatrix)
}


function createMatrixButtons(matrix) {
  let labelColors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255]];

  let container = document.getElementById("matrix-container");
  container.innerHTML = "";

  
  
  let rowLabel = document.createElement("div");
  rowLabel.classList.add("matrix-label");
  container.appendChild(rowLabel);

  for (let i = 0; i < matrix.length; i++) {
    let rowLabel = document.createElement("div");
    rowLabel.classList.add("matrix-label");
    rowLabel.style.backgroundColor = `rgb(${labelColors[i][0]}, ${labelColors[i][1]}, ${labelColors[i][2]})`;
    container.appendChild(rowLabel);
  }

    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));

  
  for (let i = 0; i < matrix.length; i++) {
    let rowLabel = document.createElement("div");
    rowLabel.classList.add("matrix-label");
    rowLabel.style.backgroundColor = `rgb(${labelColors[i][0]}, ${labelColors[i][1]}, ${labelColors[i][2]})`;
    container.appendChild(rowLabel);
    
    for (let j = 0; j < matrix[i].length; j++) {
      let button = document.createElement("button");
      button.classList.add("matrix-button");
      button.style.width = "40px";
      button.style.height = "40px";
      button.i = i
      button.j = j


      // button.style.backgroundColor = "rgb(" + map(matrix[i][j], 1, -1, 0, 255) + ", " + map(matrix[i][j], -1, 1, 0, 255) + ", 0)";
      let redValue = map(matrix[i][j], -1, 1, 255, 0);
      let greenValue = map(matrix[i][j], -1, 1, 0, 255);

      button.style.backgroundColor = `rgb(${redValue}, ${greenValue}, 0)`;
      
      button.textContent = matrix[i][j].toFixed(2);
      container.appendChild(button);
      
      
      button.addEventListener("keydown", (event) => {
        if (event.key === "+" || event.key === "-") {
          let activeElement = document.activeElement;
          if (activeElement.classList.contains("matrix-button")) {
            let i = parseInt(activeElement.i);
            let j = parseInt(activeElement.j);
            if (event.key === "+") {
              matrix[i][j] = Math.min(matrix[i][j] + 0.1, 1);
            } else {
              matrix[i][j] = Math.max(matrix[i][j] - 0.1, -1);
            }
            activeElement.textContent = matrix[i][j].toFixed(2);
            let redValue = map(matrix[i][j], -1, 1, 255, 0);
            let greenValue = map(matrix[i][j], -1, 1, 0, 255);
            activeElement.style.backgroundColor = `rgb(${redValue}, ${greenValue}, 0)`;

          }
        }
      });
    }
    let newline = document.createElement("br");
    container.appendChild(newline);
  }
}



function createMatrix(n, diagonalValue) {
  let matrix = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      if (i === j && diagonalValue !== undefined) {
        row.push(diagonalValue);
      } else {
        row.push(Math.random() * 2 - 1);
      }
    }
    matrix.push(row);
  }
  return matrix;
}


function constrainBorder(vector, mode='teleport') {
  //++ ezt majd úgy kell megcsinálni, hogy ne használja a globális méretet!
  let outputVector = vector.copy();
  if (vector.x > width) {
    switch (mode) {
      case 'limit':
        outputVector.x = width;
        break;
      case 'teleport':
        outputVector.x = 0;
        break;
    }
  }
  if (vector.x < 0) {
    switch (mode) {
      case 'limit':
        outputVector.x = 0;
        break;
      case 'teleport':
        outputVector.x = width;
        break;
    }
  }
  if (vector.y > height) {
    switch (mode) {
      case 'limit':
        outputVector.y = height;
        break;
      case 'teleport':
        outputVector.y = 0;
        break;
    }
  }
  if (vector.y < 0) {
    switch (mode) {
      case 'limit':
        outputVector.y = 0;
        break;
      case 'teleport':
        outputVector.y = height;
        break;
    }
  }
  return outputVector
}




