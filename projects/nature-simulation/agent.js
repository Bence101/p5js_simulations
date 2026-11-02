class Agent {
  constructor(pos) {
    this.entityType = 'agent';
    this.entityId = entityIdGenerator();
    
    this.pos = pos;
    this.velocity = createVector(1, 2); //p5.Vector.random2D()
    this.acceleration = createVector(0, 0);
    this.angle = this.velocity.heading();
    this.angleVelocity = 0;
    this.angleAcceleration = 0;

    this.target = createVector(100, 100);
    this.targetType = 'random'; //'random', 'food', 'prey', 'mate'...
    this.desire = 'random';
    
    
    this.speed = 1.8;

    this.fieldOfView = 100;
    this.reachDistance = 20;

    this.size = 10;
    this.color = color(100, 100, 100);
    
    
    // health handling
      // jelenleg még a health és az éhség egyet jelent
      // a későbbiekben ezeket szét kell választani
    this.alive=1;
    this.health=100;
    this.maxHealth=100;
    this.baseHealthLoosingRate=0.5;
    
    this.tmpHealthForTargetReach=20;
    
    this.healthBar = new statusBar(this.pos, this.health/this.maxHealth);
    
    // ageing
    this.age=0;
    this.ageingRate=0.1;
    
    // reproduction
    this.createOffspring = 0;
    this.reproductionCooldown=30;
    this.reproductionCooldownRate=0.1;
    
    // food
    this.closestFood=undefined;
  }
  
  update() {
    this.deathCheck();
    this.checkForReproduction();
    this.grewOld()
    this.handleCooldowns()
    
    this.eat()
    
    this.setDesire()
    this.setTarget();
    this.move();
    this.testDisplay();
    
    this.loseHealth(this.baseHealthLoosingRate);
    this.healthBar.update(this.pos, this.health/this.maxHealth);
  }

  
  gainHealth(healthPoint) {
    this.health+=healthPoint;
    this.health=constrain(this.health, 0, this.maxHealth);
  }
  
  loseHealth(healthPoint) {
    this.health-=healthPoint;
    this.health=constrain(this.health, 0, this.maxHealth);
  }
  
  grewOld() {
    this.age+=this.ageingRate
  }
  
  handleCooldowns() {
    this.reproductionCooldown-=this.reproductionCooldownRate;
    this.reproductionCooldown=max(this.reproductionCooldown, 0);
  }
  
  
  checkForReproduction() {
    if (this.health>95 && 
        this.age>10 && 
        this.reproductionCooldown<=0) {
      this.createOffspring = 1;
      this.reproductionCooldown=10;
    }
  }
  
  
  deathCheck() {
    if (this.health<=0) {
      this.alive = 0;
    }
  }
  
  setDefaults() {
    this.acceleration = createVector(0, 0);
  }
  

  move() {
    this.accelerateToTarget();
    // this.accelerateRandomly();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.speed);
    this.pos.add(this.velocity);
    this.angle = this.velocity.heading();
    this.pos = constrainBorder(this.pos, 'teleport');
    this.setDefaults();
  }


  accelerateToTarget() {
    let target = createVector(this.target.x - this.pos.x, this.target.y - this.pos.y);
    target.normalize();
    this.applyAcceleration(target, 0.1); // a második argumentum még kérdéses
  }


  // accelerateToTarget() {
  //   let target = createVector(this.target.x - this.pos.x,     this.target.y - this.pos.y);
  //   target.normalize();
  //   this.applyAcceleration(target, 0.1); // a második argumentum még kérdéses
  // }

  
  
  setRandomTarget() {
    if (this.pos.dist(this.target) < this.reachDistance || 
        this.pos.dist(this.target) > this.fieldOfView) {
      let tmpRandomRadius =this.fieldOfView;
      let target = createVector(this.pos.x + random(-tmpRandomRadius, tmpRandomRadius),
        this.pos.y + random(-tmpRandomRadius, tmpRandomRadius));
      target = constrainBorder(target, 'limit');
      this.target = target;
    }
  }
  
  setTarget() {
    switch (this.desire) {
      case 'food':
        // követi a kaját és eszik, ha talált
        if (this.closestFood) {
          this.target=this.closestFood.pos;
        } else {
          this.setRandomTarget()
        }
        break;
      case 'random':
        this.setRandomTarget()
        break;
    }
  }
  
  eat() {
    if (this.desire == 'food' && this.closestFood) {
        // valamiért miután meg lett éve és 
        if (this.pos.dist(this.closestFood.pos)<this.reachDistance) {
          if (!this.closestFood.eaten) {
            this.gainHealth(this.closestFood.nutritionalValue);
          }
          
          this.closestFood.eaten=1;
          this.closestFood=undefined;
        }
    }
  }

  setDesire() {
    // alapesetben random
    this.desire = 'random'; 
    
    // ha kevés az élete, akkor food
    if (this.health<90) {
        this.desire = 'food';
    }
    
    // ez lehet, hogy ugyanaz, mint a target
    // logika:
      // először ellenőrizzük az ellenséget (ehhez végig kell menni az összes ellsenségen, a wolf-nak nincs ellensége, úgyhogy ezt majd végig kell gondolni!)
          // T: fleeEnemy()
      // ezután ellenőrizzük a mate-et, hogy tudjuk, hogy mate képes-e már? (akkor az, ha eleget evett)
          // T: searchMate() -> target: legközelebbi mate, aki mate képes
      // ha egyik sem igaz, akkor kaját akar
          // T: searchFood() -> target: legközelebbi kaja
      // ha nincs kaja, akkor random célpont
  }
  
  searchFood() {}
  searchMate() {}
  searchEnemy() {}
  
  fleeEnemy() {} // a seperation kód elvileg jó lesz, target: ellenség elkerülési pont

  // createRandomTarget() {
  //   let tmpRandomRadius =this.fieldOfView;
  //   let target = createVector(this.pos.x + random(-tmpRandomRadius, tmpRandomRadius),
  //     this.pos.y + random(-tmpRandomRadius, tmpRandomRadius));
  //   target = constrainBorder(target, 'limit');
  //   return target;
  // }

  mouseTarget() {
    let target = createVector(mouseX, mouseY);
    target = constrainBorder(target, 'limit');
    return target;
  }

  applyAcceleration(directionVector, forceMagnitude) {
    this.acceleration.add(directionVector.copy().setMag(forceMagnitude));
  }


  testDisplay() {
    switch (this.desire) {
      case 'food':
        fill(color(0, 255, 0));
        break;
      case 'random':
        fill(color(200, 0, 0));
        break;
    }

    ellipse(this.target.x, this.target.y, 10, 10);

    // noFill();
    // ellipse(this.pos.x, this.pos.y, this.fieldOfView*2, this.fieldOfView*2);

    fill(color(0, 0, 0));
    // text(this.entityId, 20, 20);
    text(this.desire, this.pos.x-3, this.pos.y+15);
  }

  display() {
    fill(this.color);
    if (!this.alive) {
      fill(color(0,0,0));
    }
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

}