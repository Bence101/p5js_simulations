let MUTATIONRATE = 0.05
let STANDARDDEVIATION = 0.1

function arrayRotate(arr, count) {
  // this is an inplace (reference) funtion
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

function mutationFunction(elem) {
  // ezt nem itt kellene tárolni!
  let mutationRate = 0.05
  if (math.random()<mutationRate) {
    let newValue = random(-elem, elem)
    return newValue;
  }
  
  return elem;
}

function mutationFunctionGaussian(elem) {
  let mutationRate = MUTATIONRATE
  let lower = -1
  let upper = 1
  let standardDeviation = STANDARDDEVIATION
  
  if (math.random()<mutationRate) {
    let newValue = randomGaussian(elem, standardDeviation)
    newValue = min(max(newValue, lower), upper)
    return newValue;
  }
  return elem
}