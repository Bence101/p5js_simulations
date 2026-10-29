function predictBackground(nn) {
  let predictedBG = []
  let w = 200
  let h = 200
  let multiplier = 1
  for (let i = 0; i< w; i++) {
      predictedBG.push([])
      for (let j = 0; j< h; j++) {
        let x = [(i-w/2)*multiplier, (j-h/2)*multiplier]
        let pred = nn.predict(x)._data
        let r = map(pred[0], 0, 1, 0, 255);
        let g = map(pred[1], 0, 1, 0, 255);
        let b = map(pred[2], 0, 1, 0, 255);
        
        predictedBG[i][j] = [r, g, b]
        // push()
        //   stroke(r, g, b)
        //   point(i, j)
        // pop()
      }    
  }
  return predictedBG
}


function drawPredictedBG(predictedBG) {
  for (let i = 0; i< predictedBG.length; i++) {
      for (let j = 0; j< predictedBG[0].length; j++) {

        push()
          stroke(predictedBG[i][j])
          // stroke(10, 20, 200)
          point(i, j)
        pop()
      }    
  }
}





const arrayToCSV = (arr, delimiter = ',') =>
  arr
    .map(v =>
      v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)
    )
    .join('\n');

function printData(nn) {
  // for excel checking
  for (let biasList of nn.biasLists) {
    // print(biasList._data)
    print(arrayToCSV([biasList._data], ',').replaceAll('.', '.'))
  }
  for (let weightTable of nn.weightTables) {

    print(arrayToCSV(weightTable._data, ',').replaceAll('.', '.'))
  }
}