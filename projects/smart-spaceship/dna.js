class DNA {
  // this class generally handles the inheritable properties of an agent
    // and the reproduction
  // currently only list like genes handled and only 1 at a time
  // the color inheritence should be here as well (I am working on it)
  constructor(lifetime, genes) {
    this.genes = genes || [];
    this.lifetime=lifetime;
    if (this.genes.length == 0) {
      this.createInitialGenes();
    }
  }
  
  createInitialGenes() {
    for (let i = 0; i < this.lifetime; i++) {
      this.genes.push(p5.Vector.random2D())
    }
  }
  
  crossover(other) {
    let midpoint = floor(random(this.genes.length));
    let newGenes = this.genes.slice(0,midpoint).concat(other.genes.slice(midpoint))
    return newGenes;
  }
  
  mutate(rate) {
    for (let i = 0; i < this.lifetime; i++) {
      if (random()<rate) {
        this.genes[i]=p5.Vector.random2D();
      }
    }
  }
  
}