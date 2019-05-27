var puyo = [];
var collisionMap = [];
var grid;
var gridSize;
new p5();
var possibleColors = [];
var drawing = true;

function setup() {
  createCanvas(600, 800);
  rectMode(CENTER);

  possibleColors.push(color(255,0,0));
  possibleColors.push(color(0,255,0));
  possibleColors.push(color(0,0,255));
  possibleColors.push(color(255,255,0));
  possibleColors.push(color(255,0,255));

  puyo.push(new Puyo(1, possibleColors));
  grid = {
      x: 6,
      y: 12
  };
  gridSize = 32;
  initalizeCollisions(grid.x + 2, grid.y + 1);
}

function draw() {
    translate(gridSize,gridSize);
  background(255);
  drawGrid();
  puyo[0].Collision();
  puyo[0].Draw();
  puyo[0].Gravity();
  if (drawing) {
    drawCollisions();
  }
}

function drawGrid() {
    var col = 0;
    for (var x = 0; x < grid.x; x++) {
        if (col == 0) {
            fill(100);
            col = 1;
        } else {
            fill(200);
            col = 0;
        }
        for (var y = 0; y < grid.y; y++) {
            if (col == 0) {
                fill(100);
                col = 1;
            } else {
                fill(200);
                col = 0;
            }
            noStroke();
            rect(x*gridSize + gridSize/2, y*gridSize + gridSize/2, gridSize, gridSize);
        }
    }
}


function keyPressed() {
    var rotation = 0;
    var movement = 0;
    if (keyCode == LEFT_ARROW) {
        rotation -= 1;
    }
    if (keyCode == RIGHT_ARROW) {
        rotation += 1;
    }

    if (keyCode == 65) {
        movement -= 1;
    }
    if (keyCode == 68) {
        movement += 1;
    }

    if (rotation != 0) {
        puyo[0].AddRotation(rotation);
    }
    if (movement != 0) {
        puyo[0].Move(movement);
    }
}

function ChooseColor() {
    console.log(possibleColors[random(0,possibleColors.length)]);
    return color (0);

}