let imageCreator;
let brush;
let imgToLoad;

function setup() {
  createCanvas(810, 610);
  imageCreator = new ImageCreator(createVector(5, 5), [800, 600])
}

function draw() {
  background(220);

  imageCreator.update(createVector(mouseX, mouseY));
  imageCreator.display();  
}

function keyPressed() {
  if (key == 'c') {
    imageCreator.changeBrush(undefined, 'circle')
  }
  if (key == 'r') {
    imageCreator.changeBrush(undefined, 'rect')
  }
  if (key == '+') {
    imageCreator.changeBrush(8)
  }
  if (key == '-') {
    imageCreator.changeBrush(-8)
  }
  if (key == 'd') {
    imageCreator.saveImage()
  }
  if (key == 'l') {
    imageCreator.loadImage(imgToLoad);
  }
}

function preload() {
  // preload() runs once
  imgToLoad = loadImage('test_img.png');
}