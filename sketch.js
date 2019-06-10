var inactivePuyos = [];
var collisionMap = [];
var grid;
var gridSize;
new p5();
var possibleColors = [];
var drawing = false;
var analyzer = new ChainAnalyzer();

var activePuyo;
var debug = false;
var pause = false;

function setup() {
    createCanvas(600, 800);
    rectMode(CENTER);
    frameRate(60);

    possibleColors.push(color(255, 0, 0));
    possibleColors.push(color(0, 255, 0));
    possibleColors.push(color(0, 0, 255));
    possibleColors.push(color(255, 255, 0));
    possibleColors.push(color(196, 64, 219));

    grid = {
        x: 6,
        y: 12
    };
    gridSize = 32;
    initalizeCollisions(grid.x + 2, grid.y + 1);

    for (var y = 0; y < grid.y; y++) {
        for (var x = 0; x < grid.x; x++) {
            puyos.push(new PuyoMap(x, y, null, true));
        }
    }
    // TEST
    activePuyo = new PuyoContainer();
}

function draw() {
    translate(gridSize, gridSize);
    background(255);
    drawGrid();
    activePuyo.Update();
    if (activePuyo.collision && puyos[2].default) {
        inactivePuyos.push(activePuyo);
        if (!pause) analyzer.AnalyzeChains();
        if (!debug) {
            activePuyo = new PuyoContainer();
            pause = false;
        } else {
            pause = true;
        }

    }
    for (var i = 0; i < inactivePuyos.length; i++) {
        inactivePuyos[i].Update();
    }
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
            rect(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
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
        debug = true;
    }
    if (keyCode == 68) {
        movement += 1;
        debug = false;
    }

    if (rotation != 0) {
        activePuyo.AddRotation(rotation, false);
    }
    if (movement != 0) {
        activePuyo.Move(movement);
    }
}