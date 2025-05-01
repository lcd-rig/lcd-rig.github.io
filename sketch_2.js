// A Convex Hull or "Gift Wrapping" algorithm creates a convex polygon surroundng a set of points
// It starts by selecting the left most point, and iteravly finds the point at the most extreme angle clockwise over and over until it has reached the first point again

var nodes = [];
var noNodes = 20;
var left;

function setup() {
  // frameRate(10)
  createCanvas(600, 600);
  for (let i = 0; i < noNodes; i++) {
    // let node = p5.Vector.random2D().mult(width/2)
    let node = new Node()
    nodes.push(node)
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2)
  let conH = new convexHull(nodes)
  conH.draw()
  nodes.forEach(node => {
    strokeWeight(3)
    node.update()
    node.draw()
  })
}

class convexHull {
  constructor(nodes) {
    this.conHullNodes = []
    this.sortedNodes = this.sortNodes(nodes)
    left = this.sortedNodes[0]
    this.getConvexHullNodes();
  }
  
  sortNodes(nodes) {
    // sorts nodes by their x position
    let sortedNodes = nodes.sort(
      (a, b) => a.pos.x - b.pos.x)
    return sortedNodes
  }

  getVertex(origin, point) {
    // returns the position vector from an origin to a point
    return (point.pos.copy().sub(origin.pos))
  }

  getRelativeAngle(a,b){
    // uses dot product to find the angle between 2 vectors
    // uses cross product to find out whether that angle is clockwise or not
    // returns a value between -1 and 1 denoting most anticlockwise to most clockwise angle
    let clock;
    if (p5.Vector.cross(a,b).z > 0){
    clock = 1
    } else {clock = -1}
    return (clock*(1- p5.Vector.dot(a, b)))
  }
  
  getConvexHullNodes() {
    // starting from the left most node, picks a random node and compares the angle between that and all other nodes
    // this can be used to work out the most clockwise node
    // the process is repeated from this node until we reach the original node again
    let original = 0;
    let prev = original;
    this.conHullNodes.push(this.sortedNodes[original])
    let index = 1;
    
    // limited iterations is safer than a while loop
    for (let i = 0; i < 50; i++) {
      let xProds = []
      let indexVertex = this.getVertex(this.sortedNodes[prev], this.sortedNodes[index])
      for (let i = 0; i < this.sortedNodes.length; i++) {
        if (i == index || i == prev) {
          continue
        }
        let otherVertex = this.getVertex(this.sortedNodes[prev], this.sortedNodes[i])
        xProds.push([i, this.getRelativeAngle(
          indexVertex.copy().div(indexVertex.mag()), 
          otherVertex.copy().div(otherVertex.mag())
        )])
      }

      let [maxIndex, maxValue] = maxIndexValue(xProds)
      if (maxValue < 0){
        maxIndex = index
      }
      
      this.conHullNodes.push(this.sortedNodes[maxIndex])

      if (maxIndex == original){
        break
      }
        
      prev = maxIndex
      index = 0
      if (index == prev){
        index = 1
      }

    }
  }
      
  draw() {
    for (let i=0; i< this.conHullNodes.length - 1; i++){
      stroke('green')
      let p1 = this.conHullNodes[i].pos
      let p2 = this.conHullNodes[i + 1].pos
      line(p1.x, p1.y, p2.x, p2.y)
    }
  }
}

function maxIndexValue(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0][1];
  var maxIndex = arr[0][0];

  for (var i = 1; i < arr.length; i++) {
    if (arr[i][1] > max) {
      maxIndex = arr[i][0];
      max = arr[i][1];
    }
  }

  return [maxIndex, max];
}

class Node {

  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2)
    );
    this.dir = p5.Vector.random2D();
    this.vel = random(0.5, 2)
    this.dir.mult(this.vel)
    this.col = 'white'
  }

  update() {
    if (this.pos.x < -width / 2 ||
      this.pos.x > width / 2) {
      this.dir.x = -this.dir.x
    }
    if (this.pos.y < -height / 2 ||
      this.pos.y > height / 2) {
      this.dir.y = -this.dir.y
    }
    this.pos.add(this.dir)
    // this.pos.add(this.dir.copy().mult(this.vel))
  }

  draw() {
    if (this == left) {
      stroke('red')
    } else {
      stroke(this.col)
    }
    point(this.pos)
  }
}