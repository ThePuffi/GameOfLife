const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let fieldSize = document.getElementById("fieldSizeSelector").value;
let cellsInRow = 100;
let cellSize = fieldSize / cellsInRow;

let speed = 10;
const deadColor = "white";
const aliveColor = "black";
let grid = new Array(cellsInRow);
let timer;

function createArray() {
  for (let x = 0; x < grid.length; x++) {
    grid[x] = new Array();
    for (let y = 0; y < grid.length; y++) {
      grid[x][y] = 0;
    }
  }
}

function randomize() {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      grid[x][y] = Math.floor(Math.random() * 1.25);
    }
  }
  return grid;
}

function nextGen(grid) {
  let nextGrid = new Array(grid.length);

  for (let x = 0; x < grid.length; x++) {
    nextGrid[x] = new Array(grid.length);
    for (let y = 0; y < nextGrid[x].length; y++) {
      const value = grid[x][y];
      const neighbors = countNeighbors(grid, x, y);

      if (value === 0 && neighbors === 3) {
        nextGrid[x][y] = 1;
      } else if (value === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[x][y] = 0;
      } else {
        nextGrid[x][y] = value;
      }
    }
  }
  return nextGrid;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  const numberOfRows = grid.length;
  const numberOfCols = grid[0].length;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let row = (x + i + numberOfRows) % numberOfRows;
      let col = (y + j + numberOfCols) % numberOfCols;
      sum += grid[row][col];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function drawPixel(event) {
  let width = event.pageX - canvas.offsetLeft;
  let height = event.pageY - canvas.offsetTop;

  let correctPositionX = width - (width % cellSize);
  let correctPositionY = height - (height % cellSize);

  if (grid[correctPositionX / cellSize][correctPositionY / cellSize] == 0) {
    ctx.fillStyle = aliveColor;
    grid[correctPositionX / cellSize][correctPositionY / cellSize] = 1;
  } else {
    ctx.fillStyle = deadColor;
    grid[correctPositionX / cellSize][correctPositionY / cellSize] = 0;
  }
  ctx.fillRect(correctPositionX, correctPositionY, cellSize - 1, cellSize - 1);
}

function draw(grid, ctx) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      const value = grid[x][y];
      let color = aliveColor;
      if (value == 0) {
        color = deadColor;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
    }
  }
}

function gen() {
  draw(grid, ctx);
  grid = nextGen(grid);
  timer = setTimeout(() => {
    requestAnimationFrame(() => gen());
  }, 100 / speed);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stop();
}

function clearArray() {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      grid[x][y] = 0;
    }
  }
}

function changeFieldSize() {
  fieldSize = document.getElementById("fieldSizeSelector").value;
  cellSize = fieldSize / cellsInRow;
  canvas.width = fieldSize;
  canvas.height = fieldSize;
}

function random() {
  stop();
  clearCanvas();
  document.getElementById("startbutton").disabled = false;
  createArray();
  randomize();
  draw(grid, ctx);
}

function stop() {
  document.getElementById("startbutton").disabled = false;
  clearTimeout(timer);
}

function start() {
  document.getElementById("startbutton").disabled = true;
  gen();
}
