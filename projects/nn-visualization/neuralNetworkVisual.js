// jelenleg van vele egy olyan probléma, hogy a biasList egyel hosszabb, mint kellene, mert az input layer is kap bias értéket
  // törölni egyszerű lenne, de sajnos ebből számolok több mindent, mint pl a layerSizes-t

class NeuralNetworkVisual {
  constructor(pos, w, h) {
    this.pos = pos;
    this.width = w;
    this.height = h;
    this.fillColor = color(200,190,180);
    this.supportParameters = {};
    this.biasLists = [];
    this.weightTables = [];
    this.nodePosList = [];
  }
  
  readNeuralNetwork(layerSizes, biasLists, weightTables, nodeOutputLists) {
    // itt majd valószínűleg valamiféle deep copy kell!
    this.layerSizes = layerSizes
    this.biasLists = biasLists
    this.weightTables = weightTables
    this.nodeOutputLists = nodeOutputLists // ezeknek a rétegenkénti min-max-át tárold le, vagy oldd meg anélkül

    
    // calculate additional data
    this.layerAmount = this.layerSizes.length;    
    this.largestLayerSize = this.layerSizes[0];
    for (let biasList of this.biasLists) {
      let biasListLen = biasList.length;
      if (biasListLen > this.largestLayerSize) {
        this.largestLayerSize = biasListLen;
      }
    }
    
    this.calculateNodeSize();
    this.calculateNodePosList();
  }
  
  calculateNodeSize() {    
    let largestDimension = max(this.largestLayerSize, this.layerAmount);
    let maxSizeController = 0.7; // parameter for max size
    this.supportParameters.nodeRadius = (this.height * maxSizeController) / 
                                        (largestDimension + 2);
    this.supportParameters.nodeRadius = this.supportParameters.nodeRadius / 2;
  }

  update(layerSizes, biasLists, weightTables, nodeOutputLists) {
    this.supportParameters = {};
    this.readNeuralNetwork(layerSizes, biasLists, weightTables, nodeOutputLists);
    this.calculateNodeSize();
  }

  calculateNodePosList() {
    this.nodePosList = [];
    
    for (let layerIndex = 0; layerIndex < this.layerSizes.length; layerIndex++) {
      let layerSize = this.layerSizes[layerIndex]
      let tmpArray = [];
      for (let nodeIndex = 0; nodeIndex < layerSize; nodeIndex++) {
        let yShift = this.height / (layerSize + 1);
        let xShift = this.width / (this.layerAmount + 1)
        tmpArray.push(createVector((layerIndex + 1) * xShift, (nodeIndex+1) * yShift))
      }
      this.nodePosList.push(tmpArray);
    }
  }
  
  
  displaySynapses() {
    for (let layerIndex = 0; layerIndex < this.layerSizes.length; layerIndex++) {
      let layerSize = this.layerSizes[layerIndex];
      let nextLayerSize = this.layerSizes[layerIndex+1];

      for (let nodeIndex = 0; nodeIndex < layerSize; nodeIndex++) {        
        if (nextLayerSize) {
          for (let nextNodeIndex = 0; nextNodeIndex < nextLayerSize; nextNodeIndex++) {
            let nodeLocation = [layerIndex, nodeIndex];
            let nextNodeLocation = [layerIndex + 1, nextNodeIndex];
            
            this.displaySynapse(nodeLocation, nextNodeLocation)
          }
        }
      }    
    }
  }
  

  displaySynapse(nodeLocation, nextNodeLocation) {
    let nodePos = this.nodePosList[nodeLocation[0]][nodeLocation[1]];
    let nextNodePos = this.nodePosList[nextNodeLocation[0]][nextNodeLocation[1]];
    let weightTable = this.weightTables[nextNodeLocation[0]-1]
    let synapseWeight = weightTable[nodeLocation[1]][nextNodeLocation[1]]
    
    let synapseColor = color(map(synapseWeight, -1, 1, 255, 0), map(synapseWeight, -1, 1, 0, 255), 0)
    let synapseWidth = 3;
    push()
      translate(this.pos.x, this.pos.y);
      stroke(synapseColor);
      strokeWeight(synapseWidth);
      line(nodePos.x, nodePos.y, nextNodePos.x, nextNodePos.y);
    
      // show weight values
      // noStroke();
      // text(str(round(synapseWeight, 2)), nodePos.x, nodePos.y + nextNodeLocation[1]*12);
    pop()
  }
  

  
  displayNodes() {
    for (let layerIndex = 0; layerIndex < this.layerSizes.length; layerIndex++) {
      let layerSize = this.layerSizes[layerIndex]
      let minNodeOutput = min(this.nodeOutputLists[layerIndex]) || 0
      let maxNodeOutput = max(this.nodeOutputLists[layerIndex]) || 0
      for (let nodeIndex = 0; nodeIndex < layerSize; nodeIndex++) {
        let nodeLocation = [layerIndex, nodeIndex]
        let nodeOutput = 0
        if (this.nodeOutputLists.length>0) {
          nodeOutput = this.nodeOutputLists[layerIndex][nodeIndex]
        }
        let nodeMagnitude = map(nodeOutput,
                                minNodeOutput, maxNodeOutput,
                                0.8, 1.2 // arbitrary multipliers
                               )
        
        nodeMagnitude = nodeMagnitude || 1 // for 1 node layers        
        this.displayNode(nodeLocation, nodeMagnitude, math.round(nodeOutput, 2))
      }
    }
  }
  
  displayNode(nodeLocation, nodeMagnitude, nodeText) {
    let nodePos = this.nodePosList[nodeLocation[0]][nodeLocation[1]];
    let nodeFillColor = color(50,150,250,150);
    push()
      translate(this.pos.x, this.pos.y);
      fill(nodeFillColor);
      noStroke();
      circle(nodePos.x, nodePos.y,
             this.supportParameters.nodeRadius * 2 * nodeMagnitude)
      fill(0)
      text(nodeText, nodePos.x, nodePos.y)
    pop()
  }
  
  display() {
    push()
      fill(this.fillColor);
      noStroke();
      rect(this.pos.x, this.pos.y, this.width, this.height)
    pop()
    
    if (this.biasLists.length>0) {
      this.displaySynapses();
      this.displayNodes();
    }


    // noLoop(); ////////////////// töröld!
  }
}