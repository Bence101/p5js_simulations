

class NeuralNetwork {
  constructor(layerSizes) {
    this.learningRate = 0.01
    this.layerSizes = layerSizes
    this.biasLists = []
    this.lastNetworkActivationValues = []
    this.weightTables = []
    this.activationFunctions = [Relu, Sigmoid]
    this.randomizeData()
  }
  
  predict(inputs, returnAllNodeValues = false) {
    // ezt szét kellene szedni feedforwardra és külön predictre
    let networkActivationValues = []
    let networkZValues = []
    let layerActivationValues = inputs
    networkActivationValues.push(inputs)
    networkZValues.push(inputs) // just so it has the same size as the ActivationValues
    
    for (let i=0; i < this.biasLists.length; i++) {
      let weightTable = this.weightTables[i]
      let biasList = this.biasLists[i]
      let activationFunction = this.activationFunctions[0].func
      if (i == this.biasLists.length-1) {
        activationFunction = this.activationFunctions[1].func
      }
      
      let outputs = this.calculateLayerOutputs(layerActivationValues, 
                                                             weightTable, 
                                                             biasList, 
                                                             activationFunction)
      layerActivationValues = outputs[0]
      let layerZValues = outputs[1]
      networkActivationValues.push(layerActivationValues._data)
      networkZValues.push(layerZValues._data)
    }
    
    this.lastNetworkActivationValues = networkActivationValues
    
    if (returnAllNodeValues) {
      return [networkActivationValues, networkZValues]
    }
    return layerActivationValues._data
  }
  
  calculateLayerOutputs(inputs, weightTable, biasList, activationFunction) {
    let zValues = math.multiply(inputs, weightTable)
    zValues = math.add(zValues, biasList)
    let activationValues = math.map(zValues, activationFunction)
    return [activationValues, zValues]
  }
  
  
  
  backpropogation(inputArray, targetArray) {
    // naming convention:
    // next: layer by the right || prev: layer by the left || current: layer in the current iteration
    let prediction = this.predict(inputArray, true)
    let networkActivationValues = prediction[0]
    let networkZValues = prediction[1]
    let networkNewNodeValues = []
    let networkGradientsW = []
    let networkGradientsB = []
    let errorsD = this.calculateErrorsD(targetArray, 
                                        networkActivationValues[networkActivationValues.length - 1])

    
    for (let i = networkActivationValues.length-1; i >= 1; i--) {
      let layerZValues = networkZValues[i]
      
      let newNodeValues = []
      
      if (i == networkActivationValues.length - 1) {
        // different calculation for the last (output) layer
        let activationFunctionD = this.activationFunctions[1].dfunc
        let layerZValuesD = math.map(layerZValues, activationFunctionD)
        newNodeValues = math.dotMultiply(layerZValuesD, errorsD)

      } else {
        let activationFunctionD = this.activationFunctions[0].dfunc
        let layerZValuesD = math.map(layerZValues, activationFunctionD)
        let nextNewNodeValues = networkNewNodeValues[0] //the new calculated node values from the last iteration (this provides the chaining)
        
        let currentNextLayerW = this.weightTables[i]._data // weights between current and next layer (this is technicly a simple derivative, but I dit not use "D")
        
        newNodeValues = math.multiply(nextNewNodeValues, 
                                          math.transpose(currentNextLayerW))
        newNodeValues = math.dotMultiply(layerZValuesD, newNodeValues)

      }
      let prevLayerActivationValues = networkActivationValues[i-1]
      let gradientsW = math.multiply(math.transpose([prevLayerActivationValues]), 
                                    [newNodeValues])
      let gradientsB = newNodeValues //(1*newNodeValues, as the derivative is just 1)
      
      // keep
      networkNewNodeValues.unshift(newNodeValues)
      networkGradientsW.unshift(gradientsW)
      networkGradientsB.unshift(gradientsB)
    }
    
    return [networkGradientsW, networkGradientsB]
    
  }
  
  applyGradients(networkGradientsW, networkGradientsB) {
    // let wLayer = 0
    // print('1', this.weightTables[wLayer]._data[0], math.multiply(networkGradientsW[wLayer], this.learningRate)[0])
    for (let i = networkGradientsW.length-1; i >= 0; i--) {
      // all lists are the same size (gradients, weights and biases)
      this.weightTables[i] = math.add(math.multiply(networkGradientsW[i], -this.learningRate), 
                                      this.weightTables[i])
      this.biasLists[i] = math.add(math.multiply(networkGradientsB[i], -this.learningRate), 
                                   this.biasLists[i])
    }
    // print('2', this.weightTables[wLayer]._data[0])

  }
  
  learn(inputArray, targetArray) {
    let gradients = this.backpropogation(inputArray, targetArray)
    let networkGradientsW = gradients[0]
    let networkGradientsB = gradients[1]
    // print('G:', networkGradientsW[0][1])
    this.applyGradients(networkGradientsW, networkGradientsB)
  }
  
  
  calculateErrors(target_array, pred_array) {
    // calculate the cost
    // ez külön osztályba kellene kerüljön, mint az aktivációs függvények is
    let errors = [];
    target_array.forEach((y, i) => {
      const error = (pred_array[i] - y)**2
      errors.push(error)
    });
    return errors
  }
  
  calculateErrorsD(target_array, pred_array) {
    // calculate the derivative of the costs
    // ez külön osztályba kellene kerüljön, mint az aktivációs függvények is
    let errorsD = [];
    target_array.forEach((y, i) => {
      const errorD = 2*(pred_array[i] - y)
      errorsD.push(errorD)
    });
    return errorsD
  }
  
  
  
  
  
  getNNData() {
    // nem tesztelt
    // itt számomra nagy kérdés, hogy átadáskor ez referenciát ad-e át?
        // valószínűleg igen, ha így van akkor ezt kezelni kell!
    let nnData = [this.getBiasLists(), 
                  this.getWeightTables(),
                  this.activationFunctions 
    ]
    return nnData
  }
  
  copy() {
    // ezt ki kell dolgozni
    return 1
  }
  
  
  getBiasLists() {
    let biasLists = []
    for (let biasList of this.biasLists) {
      biasLists.push(biasList._data)
    }
    return biasLists
  }
  
  getWeightTables() {
    let weightTables = []
    for (let weightTable of this.weightTables) {
      weightTables.push(weightTable._data)
    }
    return weightTables
  }
  
  

  
  randomizeData() {
    // for first inicialization
    // jelenleg ezt csak inicializáláskor lehet futtatni, de ha kell, akkor át lehet alakítani
    for (let i=0; i < this.layerSizes.length; i++) {
      
      let nodeAmount = this.layerSizes[i]
      if (i>0) {
        // we leave out the first layer
        let biasList = math.matrix(math.random([nodeAmount], -1, 1))
        this.biasLists.push(biasList)
      }
      
      if (i+1 < this.layerSizes.length) {
        let nextNodeAmount = this.layerSizes[i+1]
        let weightTable = math.matrix(math.random([nodeAmount, nextNodeAmount],
                                                  -1, 1))
        this.weightTables.push(weightTable)
      }
    }
  }
  
  calculateAccuracy(inputArray, targetArray) {
    // currently only works for binary classification!
    let truePositive = 0
    for (let i=0; i < inputArray.length; i++) {
      // data point level
      const prediction = this.predict(inputArray[i])
//       for (let nodeIndex=0; nodeIndex < prediction.length; nodeIndex++) {
//         // output layer level
//         // not yet implemented
//       }
      if (round(prediction[0]) == targetArray[i][0]) {
        truePositive++
      }
    }
    let accuracy = truePositive/inputArray.length
    return accuracy
  }

  
  calculateAvgError(inputArray, targetArray) {
    // hard to interpret
    let totalAvgErrors = 0
    for (let i=0; i < inputArray.length; i++) {
      // data point level
      const prediction = this.predict(inputArray[i])
      const errors = this.calculateErrors(targetArray[i], prediction)
      const sumErrors = errors.reduce((a, b) => a + b, 0);
      const avgErrors = sumErrors/errors.length
      totalAvgErrors +=avgErrors
    }
    return totalAvgErrors/inputArray.length
  }
}





class Sigmoid  {
  // https://ml-cheatsheet.readthedocs.io/en/latest/activation_functions.html
     static func(z) {
       return 1 / (1 + math.exp(-z))
     }
     static dfunc(z) {
       let activation = Sigmoid.func(z)
       return activation * (1 - activation)
     }
}

class Relu  {
  // https://ml-cheatsheet.readthedocs.io/en/latest/activation_functions.html
     static func(z) {
       return math.max(0, z)
     }
     static dfunc(z) {
       if (z > 0) {
         return 1
       }
       return 0
     }
}


class LeakyRelu  {
  // https://ml-cheatsheet.readthedocs.io/en/latest/activation_functions.html
    static alpha = 0.01
     static func(z) {
       // let a = alpha
       return math.max(LeakyRelu.alpha*z, z)
     }
     static dfunc(z) {
       if (z > 0) {
         return 1
       }
       return LeakyRelu.alpha
     }
}




// class NeuralNetworkData {
//   constructor(nodeAmounts) {
//     this.nodeAmounts = nodeAmounts;
//     this.biasLists = [];
//     this.weightTables = [];
//     this.nodeOutputLists = []; // ezt ténylegesen majd az inputból kell számolni!
//     this.randomizeData();
//   }
  
//   randomizeData() {
//     for (let i=0; i < this.nodeAmounts.length; i++) {
//       let nodeAmount = this.nodeAmounts[i]
//       this.biasLists.push(Array(nodeAmount).fill().map(() => Math.random()))
//       this.nodeOutputLists.push(Array(nodeAmount).fill().map(() => (Math.random()*2) -1))
//       if (i+1 < this.nodeAmounts.length) {
//         let nextNodeAmount = this.nodeAmounts[i+1]
//         let weightTable = this.create2DRandomArray(nodeAmount, nextNodeAmount)
//         this.weightTables.push(weightTable)
//       }
//     }
//   }
  
//   create2DRandomArray(r, c) {
//     // ebből lehetne önálló function, ha kell máshol is
//     let matrix = [] 
//     for (let i=0; i<r; i++) {
//       let tmpArray = [];
//       for (let j=0; j<c; j++) {
//         tmpArray.push(random(-1, 1))
//       }
//       matrix.push(tmpArray)
//     }
//     return matrix
//   }
// }