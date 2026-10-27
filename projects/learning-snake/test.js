// // paraméterezett map használata

// let testArr = [1, 2, 3, 4]
// let params = [2, 3]

// function testFunc(value, toAdd, multiplier) {
//   return value * multiplier + toAdd
// }

// function mutate(arr, func, params) {
//   // let arrMod = arr.map(x => func(x, ...params))
//   let matrix = math.matrix(arr)
//   let matrixMod = math.map(matrix, x => func(x, ...params))
//   console.log(matrixMod)
// }

// // mutate(testArr, testFunc, params)
// // console.log(math.matrix(testArr))


// // nn test
// let testNN = new NeuralNetwork([2,2,2])
// // console.log(testNN.weightTables[0]._data)
// // console.log(testNN.weightTables[1]._data)
// console.log(testNN.biasLists[0]._data)
// console.log(testNN.biasLists[1]._data)
// function myMutateFunction(value, toAdd) {
//   return value+toAdd
// }

// testNN.mutate(myMutateFunction, [2])
// // console.log(testNN.weightTables[0]._data)
// // console.log(testNN.weightTables[1]._data)
// console.log(testNN.biasLists[0]._data)
// console.log(testNN.biasLists[1]._data)
