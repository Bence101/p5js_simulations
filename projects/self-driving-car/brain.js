class Brain {
  constructor(nn) {
    // This class will be used to display the NN later. Currently only a placeholder.
    if (nn) {
      this.nn = nn.copy();
    } else {
      // do not change the first and last layers as they are the input and output layers that are fixed sized
      this.nn = new NeuralNetwork(6, 4, 3, 4);
    }
  }

  update(points) {

  }

  display() {
    
  }
}