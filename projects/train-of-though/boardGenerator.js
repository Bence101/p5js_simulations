class BoardGenerator {
  constructor(tiles, nStations, boardSize, forbidStackingJunctions) {
    this.boardSize = boardSize;
    this.tiles = tiles;
    this.junctionProbability = 0.9;
    this.nStations = nStations;
    this.openEnds = [];
    this.forbidStackingJunctions = forbidStackingJunctions;
  }

  generateBoard() {
    const maxAttempts = 16;
    const maxPlacements = this.boardSize[0] * this.boardSize[1] - this.nStations;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      this.tiles.length = 0;
      this.openEnds.length = 0;

      if (!this.generateFirstTileLoc()) {
        continue;
      }

      let complete = false;
      for (let placement = 0; placement < maxPlacements; placement++) {
        this.listOpenEnds();
        if (this.openEnds.length === this.nStations) {
          this.generateStations();
          complete = true;
          break;
        }
        if (this.openEnds.length === 0 || this.openEnds.length > this.nStations) {
          break;
        }

        const openEnds = this.openEnds.slice();
        for (let index = openEnds.length - 1; index > 0; index--) {
          const swapIndex = Math.floor(Math.random() * (index + 1));
          [openEnds[index], openEnds[swapIndex]] = [openEnds[swapIndex], openEnds[index]];
        }

        let placed = false;
        for (const openEnd of openEnds) {
          if (this.generateNextTile(openEnd[3], false, openEnd)) {
            placed = true;
            break;
          }
        }
        if (!placed) {
          break;
        }
      }

      if (complete) {
        return { success: true, attempts: attempt };
      }
    }

    this.tiles.length = 0;
    this.openEnds.length = 0;
    return { success: false, attempts: maxAttempts };
  }

  generateStations() {
    let stationNum = 1;
    for (let openEnd of this.openEnds) {
      let tileCandidate = new Tile(stationNum, openEnd[0], openEnd[1], 
                             openEnd[2], openEnd[2]);
      this.tiles.push(tileCandidate);
      stationNum++;
    }
  }

  listOpenEnds() {
    this.openEnds = [];
    for (let tile of this.tiles) {
      let possiblePoses = this.getNextPossiblePoses(tile);
      for (let possiblePos of possiblePoses) {
        if (!this._isPosOccupied(possiblePos[0], possiblePos[1])) {
          possiblePos.push(tile);
          this.openEnds.push(possiblePos)
        }
      }
    }
  }

  generateFirstTileLoc() {
    let firstTile;    
    let side = getRandomIntInclusive(0, 3);
    let x;
    let y;
    let start;
    let end;

    if (side == 0) {
      x = 0;
      y = getRandomIntInclusive(1, this.boardSize[1]-2);
      start = 0;
      end = [1, 2, 3][getRandomIntInclusive(0, 2)]

    }
    if (side == 2) {
      x = this.boardSize[0]-1;
      y = getRandomIntInclusive(1, this.boardSize[1]-2);
      start = 2;
      end = [0, 1, 3][getRandomIntInclusive(0, 2)]
    }
    if (side == 1) {
      x = getRandomIntInclusive(1, this.boardSize[0]-2);
      y = this.boardSize[1]-1;
      start = 1;
      end = [0, 2, 3][getRandomIntInclusive(0, 2)]
    }
    if (side == 3) {
      x = getRandomIntInclusive(1, this.boardSize[0]-2);
      y = 0;
      start = 3;
      end = [0, 1, 2][getRandomIntInclusive(0, 2)]
    }
    firstTile = new Tile(0, x, y, start, end, undefined, 1)
    this.tiles.push(firstTile);

    if (!this.generateNextTile(firstTile, true)) {
      return false;
    }
    return this.generateNextTile(this.tiles[this.tiles.length - 1], true);
  }

  generateNextTile(tile, singleSided = false, openEnd) {
    const possiblePoses = openEnd
      ? [openEnd]
      : this.getNextPossiblePoses(tile);
    const canMakeJunction = !singleSided
      && !(tile.endSideB !== undefined && this.forbidStackingJunctions);
    const candidates = [];

    for (const [x, y, startSide] of possiblePoses) {
      if (this._isPosNotOnBoard(x, y) || this._isPosOccupied(x, y)) {
        continue;
      }

      const endSides = [0, 1, 2, 3].filter((side) => side !== startSide);
      const singleWeight = canMakeJunction ? 1 - this.junctionProbability : 1;
      for (const endSideA of endSides) {
        if (this._isValidPos(x, y, endSideA)) {
          candidates.push({ x, y, startSide, endSideA, weight: singleWeight });
        }

        if (!canMakeJunction) {
          continue;
        }
        for (const endSideB of endSides) {
          if (endSideB !== endSideA && this._isValidPos(x, y, endSideA, endSideB)) {
            candidates.push({
              x,
              y,
              startSide,
              endSideA,
              endSideB,
              weight: this.junctionProbability / (endSides.length - 1),
            });
          }
        }
      }
    }

    if (candidates.length === 0) {
      return false;
    }

    const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
    let selection = Math.random() * totalWeight;
    let candidate = candidates[candidates.length - 1];
    for (const option of candidates) {
      selection -= option.weight;
      if (selection < 0) {
        candidate = option;
        break;
      }
    }

    this.tiles.push(new Tile(
      0,
      candidate.x,
      candidate.y,
      candidate.startSide,
      candidate.endSideA,
      candidate.endSideB,
    ));
    return true;
  }

  _isValidPos(x, y, endSideA, endSideB) {
    if (this._isPosNotOnBoard(x, y)) {return false}
    if (this._isPosOccupied(x, y)) {return false}
    if (this._isEndSidePointsInvalidPos(x, y, endSideA)) {return false}
    if (endSideB !== undefined) {
      if (this._isEndSidePointsInvalidPos(x, y, endSideB)) {return false}
    }
    
    return true
  }
  
  _isPosNotOnBoard(x, y) {
    if (Math.min(x, y)<0 || 
        x>(this.boardSize[0]-1) || 
        y>(this.boardSize[1]-1)) {
      return true
    }
    return false
  }
  
  _isPosOccupied(x, y) {
    for (let tile of this.tiles) {
      if (tile.x==x && tile.y == y) {
        return true;
      }
    }
    return false
  }
  
  _isPosOccupiedByOpenEnd(x, y) {
    let counter = 0;
    for (let openEnd of this.openEnds) {
      if (openEnd[0] == x && openEnd[1] == y) {
        counter++;
      }
    }
    if (counter>0) {
      return true
    }    
    return false
  }
  
  _isPosOnEdge(x, y) {
    if (Math.min(x, y)==0 || 
        x==(this.boardSize[0]-1) || 
        y==(this.boardSize[1]-1)) {
      return true
    }
    return false
  }
  
  _isEndSidePointsOutside(x, y, endSide) {
    if (x==0 && endSide==0) {return true}
    if (x==this.boardSize[0]-1 && endSide==2) {return true}
    if (y==0 && endSide==3) {return true}
    if (y==this.boardSize[1]-1 && endSide==1) {return true}
    return false
  }
  
  _isEndSidePointsInvalidPos(x, y, endSide) {
    if (this._isPosOnEdge(x, y)) {
      if (this._isEndSidePointsOutside(x, y, endSide)) {return true}
    }
    
    // this only returns 1 pos if only 1 endSide given
    let nextPos = this.getNextPossiblePoses([x, y, endSide])[0];
    if (this._isPosOccupied(nextPos[0], nextPos[1])) {return true}
    if (this._isPosOccupiedByOpenEnd(nextPos[0], nextPos[1])) {return true}
    return false;
  }
  
  _choseEndSides(startPos) {
    let randomEndSideA = [0, 1, 2, 3];
    let randomEndSideB = [0, 1, 2, 3];
    randomEndSideA = randomEndSideA.filter(function(value, index, arr){ 
        return value != startPos;
    });
    randomEndSideA = randomEndSideA[Math.floor(Math.random()*randomEndSideA.length)]
    if (Math.random()>this.junctionProbability) {return [randomEndSideA, undefined]}
    
    randomEndSideB = randomEndSideB.filter(function(value, index, arr){ 
        return !([startPos, randomEndSideA].includes(value));
    });
    
    randomEndSideB = randomEndSideB[Math.floor(Math.random()*randomEndSideB.length)]
    return [randomEndSideA, randomEndSideB]
  }
  
  getNextPossiblePoses(input) {
    let x;
    let y;
    let endSideA;
    let endSideB;
    if (Array.isArray(input)) {
      x = input[0];
      y = input[1];
      endSideA = input[2];
      endSideB = input[3];
    } else {
      x = input.x;
      y = input.y;
      endSideA = input.endSideA;
      endSideB = input.endSideB;
    }
    
    let possiblePoses = [];
    if (endSideA == 0) {
      possiblePoses.push([x - 1, y, 2])
    }
    if (endSideA == 1) {
      possiblePoses.push([x, y + 1, 3])
    }
    if (endSideA == 2) {
      possiblePoses.push([x+1, y, 0])
    }
    if (endSideA == 3) {
      possiblePoses.push([x, y - 1, 1])
    }
    if (endSideB !== undefined) {
      if (endSideB == 0) {
        possiblePoses.push([x - 1, y, 2])
      }
      if (endSideB == 1) {
        possiblePoses.push([x, y + 1, 3])
      }
      if (endSideB == 2) {
        possiblePoses.push([x+1, y, 0])
      }
      if (endSideB == 3) {
        possiblePoses.push([x, y - 1, 1])
      }
    }
    
    // return: [[nextX, nextY, nextStartSide]
    //           undefined || nextX2, nextY2, nextStartSide2]]
    return possiblePoses
  }
}
