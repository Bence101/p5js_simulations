class TrackBuilder {
  constructor() {
    this.nodeListOfList = [[], [], []]
    this.currentCircle = 0;
    this.selectedNode = undefined;
    this.mode = 'side1'; 
    this.mode = 0; // 0: side1, 1: side2, 2: checkpoint
    // ahelyett, hogy mindig a .nodes-t töltöm hozz létre három listát és mindent írj át úgy, hogy ezeket a listákat töltsd a node-oknak megfelelően
    // elvben a checkpointok is mehetnek 1 listába, ha a törlésnél egyszerre mindig kettőt törlünk; arra viszont itt figyelni kell, hogyha pl párosat törlünk, akkor az utánalévőt ha páratlant akkor az előtte lévőt töröljük velük együtt. Illetve ott nincs értelme a selectionnak. Elvben ez a két szabáj elég lehet, hogy a lenti logikát minél jobban újra tudjuk használni. 

  }

  update(points) {

  }
  
  changeMode() {
    this.selectedNode = undefined;
    if (this.mode < 2) {
      this.mode++;
    } else {
      this.mode = 0
    }
  }
  
  getNodeList() {
    return this.nodeListOfList[this.mode]
  }
  
  addNode(pos) {
    let nodeList = this.getNodeList();
    // ha meglévőre kattint, akkor ne történjen semmi
    if (this.selectedNode < 0 || this.selectedNode == undefined) {
      nodeList.push(new TrackNode(pos));
    } else {
      nodeList.splice(this.selectedNode+1, 0, new TrackNode(pos));
      this.selectedNode += 1;
    }    
  }
  
  removeNode(pos) {
    let nodeList = this.getNodeList();

    this.selectedNode = undefined;
    // this is a simple inplace filter
    // source: https://stackoverflow.com/questions/37318808/what-is-the-in-place-alternative-to-array-prototype-filter
    if (this.mode == 2) {
      // for checkpoints we delete them as pairs
      for (let i = 0; i < nodeList.length; i += 1) {
        let node = nodeList[i]
        if (node.onIt(pos)) {
          if (i % 2 == 0) {
            nodeList.splice(i, 2);
          }
          if (i % 2 == 1) {
            nodeList.splice(i-1, 2);
          }
        }
      }
    } else {
      nodeList.splice(0, nodeList.length, 
                      ...nodeList.filter(node => !node.onIt(pos)))
    }
    
  }
  
  selectNode(pos) {
    let nodeList = this.getNodeList();

    let selection = nodeList.findIndex(node => node.onIt(pos));
    
    if (selection >= 0 && this.mode !=2) {
      this.selectedNode = selection;
    }
    return selection;
  }
  
  
  
  mousePressed() {
    let mousePos = createVector(mouseX, mouseY);
    if (mouseButton == LEFT) {
      let hasSelectedNode = this.selectNode(mousePos);
      if (hasSelectedNode < 0) {
        this.addNode(mousePos);
      }
    }
    if (mouseButton == CENTER) {
      this.removeNode(mousePos);
    }
  }
  
  saveTrack() {
    let output = []
    for (let i = 0; i < this.nodeListOfList.length; i += 1) {
      output.push([])
      let nodeList = this.nodeListOfList[i];
      for (let j = 0; j < nodeList.length; j += 1) {
        let node = nodeList[j]
        output[i].push([node.pos.x, node.pos.y])
      }
    }
    save({"nodeListOfList": output}, 'track.json')
  }
  
  loadTrack(jsonFile) {
    let loadedNodeListOfList = jsonFile.nodeListOfList;
    this.nodeListOfList = [[], [], []]
    
    for (let i = 0; i < loadedNodeListOfList.length; i += 1) {
      let loadedNodeList = loadedNodeListOfList[i];
      for (let j = 0; j < nodeList.length; j += 1) {
        let node = nodeList[j]
        output[i].push([node.pos.x, node.pos.y])
      }
    }
  }
  
  keyPressed() {
    if (key == 'm') {
      this.changeMode();
    }
    
    if (key == '1') {
      print(this.nodeListOfList[0])
    }
    if (key == '2') {
      print(this.nodeListOfList[1])
    }
    if (key == '3') {
      print(this.nodeListOfList[2])
    }
    if (key == 'd') {
      print(this.mode)
    }
    if (key == 's') {
      this.saveTrack()
      // localStorage.setItem('myCat', 'Tom');
    }
  }
  
  
  displayAllNodes() {
    for (let i = 0; i < this.nodeListOfList.length; i++) {
      let nodeList = this.nodeListOfList[i]
      if (nodeList) {
      push();
      noFill();
      stroke(200);
      strokeWeight(2)
      if (this.mode == i) {
        stroke(color(0, 200, 0));
        strokeWeight(4)
      }
      if (i == 2) {
        let len = nodeList.length
        if (len % 2 == 1) {len -= 1}
        for (let j = 0; j < len; j += 2) {
          if (len > 1) {
            let node1 = nodeList[j];
            let node2 = nodeList[j+1];
            line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
          }
        }
      } else {
        beginShape();
        for (let node of nodeList) {
          vertex(node.pos.x, node.pos.y);
        }
        endShape(CLOSE);
        pop();
      }
      nodeList.forEach((object, i) => object.display(i));
      }
    }
  }
  
  displaySelected() {
    let nodeList = this.getNodeList();

    if (this.selectedNode >= 0 && nodeList[this.selectedNode]) {
      let selectedNode = nodeList[this.selectedNode]
      push();
      fill(color(0, 255, 0));
      noStroke();
      circle(selectedNode.pos.x, selectedNode.pos.y, 10)
      pop();
    }
  }

  display() {
    this.displayAllNodes();
    this.displaySelected();
  }
}

class TrackNode {
  constructor(pos) {
    this.pos = pos;
    this.r = 15
  }

  onIt(pos) {
    if (this.pos.dist(pos)<this.r) {
      return true
    }
    return false
  }

  display(i) {
    push();
    strokeWeight(2);
    stroke(255);
    fill(0);
    circle(this.pos.x, this.pos.y, this.r*2);
    noStroke();
    fill(255)
    textSize(15)
    text(str(i), this.pos.x, this.pos.y+this.r/2)
    pop();
  }
}