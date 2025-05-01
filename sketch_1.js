// Implementation of Game of Life with periodic boudry conditions

// Space to clear grid
// click to place creature
// num keys to change creature
// "r" rotates creature orientation
// "p" to pause
// while paused use right key to advance a single frame
// "Backspace" to enter delete mode

// Game of life is a 2D simulation based on a simple set of grid based rules, created by mathmatician John Conway

// RULES

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

// improvements
// 1. wrap around cells at edges (Done)
// 2. enable wrap around for creating creatures (Done)
// 3. improve performance to support 100x100 cells (Done)

var xcells = 100;
var ycells = 100;
var universeX = 800;
var universeY = 800;
var startCellsPercent = 10;
var framerate = 30;
var body = glider();

var prevKey = 1;
var xSize;
var ySize;
var grid;
var nextGrid;
var baseGrid;
var dir = 0;
var ymax;
var xmax;
var paused = false;
var debug = false;
var kill = false;

function setup() {
  frameRate(framerate)
  xSize = universeX / xcells
  ySize = universeY / ycells
  ymax = ycells - 1
  xmax = xcells - 1
  
  createCanvas(universeX, universeY);
  grid = create2DArray(grid);
  
  for (
    let i = 0; 
    i < (startCellsPercent/100) * xcells * ycells; 
    i++
  ) {
    let x = round(random(xcells - 1))
    let y = round(random(ycells - 1))
    grid[y][x] = 1
  }
}

function draw() {
  strokeWeight(0.5)
  background('white')
  neighbours()
  life()
  world()
}

function neighbours() {
  nextGrid = create2DArray()
  // prettyPrint(grid, name='grid')
  let yU, yD, xU, xD;
  for (let y = 0; y < ycells; y++) {
    for (let x = 0; x < xcells; x++) {
      if (grid[y][x] == 1) {
        
        // print(`${x} ${y}`)
        if (y == 0){ yD=ymax } else { yD=y-1 }
        if (y == ymax){ yU=0 } else { yU=y+1 }
        if (x == 0){ xD=xmax } else { xD=x-1 }
        if (x == xmax){ xU=0 } else { xU=x+1 }

          nextGrid[yD][xD] += 1
          nextGrid[yD][x] += 1
          nextGrid[yD][xU] += 1
          nextGrid[y][xD] += 1
          nextGrid[y][xU] += 1
          nextGrid[yU][xD] += 1
          nextGrid[yU][x] += 1
          nextGrid[yU][xU] += 1

      }
    }
  }
  // prettyPrint(nextGrid, name='nextGrid')
}

function life() {
  for (let y = 0; y < ycells; y++) {
    for (let x = 0; x < xcells; x++) {
      if (nextGrid[y][x] == 3) {
        grid[y][x] = 1
      } else if (grid[y][x] == 1 && nextGrid[y][x] == 2) {
        grid[y][x] = 1
      } else {
        grid[y][x] = 0
      }
    }
  }
}

function drawSquare(x, y, color=0) {
    fill(color)
    rect(x * xSize, y * ySize, xSize, ySize)
}

function world() { 
  
  fill('red')
  rect(
    round(xcells/2) * xSize, 
    round(ycells/2) * ySize, 
    xSize, 
    ySize
  )
  
  for (let y = 0; y < ycells; y++) {
    line(y * ySize, 0, y * ySize, height)
    for (let x = 0; x < xcells; x++) {
      line(0, x * xSize, width, x * xSize)
      if (grid[y][x] == 1) {
        drawSquare(x, y)
      }
    }
  }

}

function pause() {
  paused = true
  console.log("PAUSE")
  noLoop()
}

function unpause() {
  paused = false
  console.log("RESUME")
  loop()
}

function keyPressed() {
  
  if (!isNaN(key)){
    kill = false
  }
  
  switch (key) {
    case '1':
      body = glider()
      break
    case '2':
      body = flapper()
      break
    case '3':
      body = mine()
      break
    case '4':
      body = pulsar()
      break
    case '5':
      body = pentaDecathalon()
      break
    case '6':
      body = gliderGun()
      break
    case '7':
      body = nuke()
      break
    case '8':
      body = megaNuke()
      break
    case '0':
      body = dot()
      break
    case 'Backspace' || 'Delete':
      kill = true
      console.log('Kill')
      break
    case 'r':
      body = rotateBody(body)
      console.log('rotate')
      break
    case 'p' || 'P':
      if (paused == false){
        pause()
      } else {
        unpause()
      }
      break
    case 'd' || 'D':
      console.log('debug')
      debug = !debug
      break
    case 'ArrowRight':
      if (paused == false){
        pause()
      }
      draw()
      break
    case ' ':
      print('clear')
      grid = create2DArray()
      draw()
      break
    default: 
  }

  
  prevKey = key

}
  
function touchStarted() {
    
  let x = floor(mouseX / xSize);
  let y = floor(mouseY / ySize);
  
  if (debug) {
    console.log('FRAME', frameCount, ':', '[', x, ',', y, ']')
  }
  
  if (kill) {
    grid[y][x] = 0
    drawSquare(x,y,'white')
  } else {
    creature(x, y, body)
  }
  
  if (paused){
    world()
  }
}
  
function rotateBody(body){

    // when o = 90
    // | 0 -1 |
    // | 1  0 |
  
    // body.forEach((tile, index)=>{
    //   body[index] = [tile[1], -tile[0]]
    // })

    //   // when o = 180
    //   // | -1  0 |
    //   // | 0  -1 |  
    //   body.forEach((tile, index)=>{
    //     body[index] = [-tile[0], -tile[1]]
    //   })
  
    //   // when o = 270
    //   // |  0  1 |
    //   // | -1  0 | 
  
    body.forEach((tile, index)=>{
      body[index] = [-tile[1], tile[0]] 
    })
  
  return body
}
  
function creature(x, y, body) {
  body.forEach(tile=>{
    try { grid[ 
      (y+ycells+tile[1])%ycells
    ][
      (x+xcells+tile[0])%xcells] = 1} catch {}
  })
}

function prettyPrint(grid, name='-----') {
  console.log(`----${name}-----`)
  grid.forEach(line => {
    console.log(line.join(' '))
  })
}

function create2DArray() {
  return Array.from({ length: ycells }, () => Array(xcells).fill(0));
}
