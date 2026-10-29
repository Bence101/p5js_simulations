
class DataSetGenerator {
//   constructor() {

//   }
  
  static generateGrid(gridSizes, dataScale) {
    let gridData = [];

    for (let y=-gridSizes[1]; y < gridSizes[1]; y++) {
        for (let x=-gridSizes[0]; x < gridSizes[0]; x++) {
          let xTransformed = map(x, -gridSizes[0], gridSizes[0], dataScale[0], dataScale[1])
          let yTransformed = map(y, -gridSizes[1], gridSizes[1], dataScale[2], dataScale[3])
          
          gridData.push([xTransformed, yTransformed])
        }
    }
    return gridData
  }
  
  static generateData(n, dataScale, splitFunction) {
    let inputs = [];
    let targets = [];
    
    for (let i=0; i < n; i++) {
      let x = random(dataScale[0] , dataScale[1])
      let y = random(dataScale[2], dataScale[3])
      let target = splitFunction(x, y)
      
      inputs.push([x, y])
      targets.push([target])
    }
    return [inputs, targets]
  }

  static linearSplitter(x, y, r=5) {
    // if (5*x+(x**2+y**2)>r**2) {
    if ((x**2+y**2)>r**2) {

      return 0
    }
    return 1
  }
  
  static flagSplitter(x, y) {
    if ((x>0) & (y>0) | (x<0) & (y<0)) {
      return 1
    }
    return 0 
  }
  
  static generateDoubleSpiral(jitterValue = 0.05, 
                              nDots = 90,
                              nSkippedDotsOnMiddle = 5,
                              nSkippedDotsOnEdge = 5,
                              spiralCoef = 18,
                              xMagnitude = 20,
                              yMagnitude = 20
                              ) {
    // source: https://conx.readthedocs.io/en/latest/Two-Spirals.html
    let inputs = [];
    let targets = [];
    
    for (let spiralNum of [-1, 1])
      for (let i=nSkippedDotsOnEdge; i < (nDots - nSkippedDotsOnMiddle); i++) {
      let fi = i/spiralCoef * Math.PI
      let r = (((nDots + nSkippedDotsOnMiddle) - i)/(nDots + nSkippedDotsOnMiddle))
      let x = (r * Math.cos(fi) * spiralNum) 
      let y = (r * Math.sin(fi) * spiralNum)
      
      x += random(-(x*jitterValue), (x*jitterValue))
      y += random(-(y*jitterValue), (y*jitterValue))
      
      inputs.push([x*xMagnitude/2, y*yMagnitude/2])
      if (spiralNum == 1) {
        targets.push([1])
      } else  {
        targets.push([0])
      }
    }
    return [inputs, targets]
  }
}


// :
// def spiral_xy(i, spiral_num):
//     """
//     Create the data for a spiral.

//     Arguments:
//         i runs from 0 to 96
//         spiral_num is 1 or -1
//     """
//     φ = i/16 * math.pi
//     r = 6.5 * ((104 - i)/104)
//     x = (r * math.cos(φ) * spiral_num)/13 + 0.5
//     y = (r * math.sin(φ) * spiral_num)/13 + 0.5
//     return (x, y)

// def spiral(spiral_num):
//     return [spiral_xy(i, spiral_num) for i in range(97)]





