new p5();
var tempPuyos = [];
var collisionMap = []; // List of numbers, 1 or 0
var grid;
var gridSize;
var puyoColors = [0, 1, 2, 3, 4]; // RED, GREEN, BLUE, YELLOW, PURPLE

// CONSTANT PUYO PROPERTIES
var speed = 2;
var chainLength = 4;

var activePuyo; // Currently falling PuyoContainer
var falling = false;

var waitFrames = 25;
var lockInFrames = 25;
var frames = 0;

var done = false;
var tempPuyosExisted = false;

let puyoSpriteSheet;
let puyoSize = 256;

// CHAIN ANALYZER
var analyzer = new ChainAnalyzer(this);

// KEY INPUT
var fastDrop = false;

var centerOffsetX = 0;
var centerOffsetY = 0;

var tempTest = true;

var bg;
var useBackground = false;
var button;

function preload() {
    puyoSpriteSheet = loadImage("Samples/Spritesheet3.png");
    bg = loadImage("Art/Background Thing.png");
}

function setup() {
    createCanvas(750, 850);
    rectMode(CENTER);
    frameRate(60);
    if (useBackground) background(bg);
    else background(color("black"));

    button = createButton("Use Background");
    button.position(0, 0);
    button.mousePressed(UseBackground);

    // GRID
    grid = {
        x: 6,
        y: 12
    };
    gridSize = 64;
    
    centerOffsetX = (750-(gridSize*6))/2;
    centerOffsetY = (850 - (gridSize*12))/2;

    // Intialize collision map
    initalizeCollisions(grid.x + 2, grid.y + 1);

    // Initialize full puyomap
    for (var y = 0; y < grid.y; y++) {
        for (var x = 0; x < grid.x; x++) {
            puyos.push(new PuyoMap(x, y, null, true));
        }
    }

    // Create the first puyos
    activePuyo = new PuyoContainer();
}

function UseBackground() {
    useBackground = !useBackground;
    if (!useBackground) {
        resizeCanvas(550, 850);
        centerOffsetX = (550-(gridSize*6))/2;
    } else {
        resizeCanvas(750, 850);
        centerOffsetX = (750-(gridSize*6))/2;
    }
}

function draw() {
    if (useBackground) background(bg);
    else background(color("black"));
    // Grid
    drawGrid();
    // Update Falling Puyo
    activePuyo.Update();

    if (analyzer.chainInterupt) {
        analyzer.PrepareChainDestroy();
    }
    // Check if the falling puyo has collided and is not at ending condition
    else if (activePuyo.status == 2 && puyos[2].default && !falling) {
        //inactivePuyos.push(activePuyo); // Move falling puyo to list of fallen puyos
        if (!done || tempPuyosExisted) {
            tempPuyosExisted = false;
            analyzer.AnalyzeChains(); // Check for a chain of 4
            done = true;
        }
        if (frames >= waitFrames && !tempPuyosExisted) {
            activePuyo = new PuyoContainer(); // Create a new falling puyo
            frames = 0;
            done = false;
        } else if (!tempPuyosExisted) frames++;
        if (frames > waitFrames) frames = waitFrames; // Stops overflow if temp is checked


    }
    for (var i = 0; i < puyos.length; i++) {
        if (puyos[i].default) continue;
        //if (falling & !puyos[i].inMap) continue;
        puyos[i].puyo.Update(); // Update each puyo that has already fallen
    }

    UpdateTemp();
}


function UpdateTemp() {
    falling = false;
    var newTemp = [];
    for (var i = 0; i < tempPuyos.length; i++) {
        tempPuyos[i].Update();
        if (!tempPuyos[i].collision) {
            newTemp.push(tempPuyos[i]);
            falling = true;
        }
    }
    tempPuyos = newTemp;
    if (newTemp.length == 0) falling = false;
}

function UpdateTempCollision() {
    for (var i = 0; i < tempPuyos.length; i++) {
        if (tempPuyos[i].collision) {
            //console.log("COLLISION");
            //console.log("SPLICER");
            tempPuyos.splice(i);
            i--;
            //return false;
        } else {
            falling = true;
        }
    }
    return true;
}

function drawGrid() {
    var col = 0;
    // Border
    if (useBackground) fill(color(255,255,255,150));
    else fill(color(255, 255, 255));
    push();
    rectMode(CORNER);
    rect(centerOffsetX - 10, centerOffsetY - 10, gridSize*6 + 20, gridSize *12 + 20);
    pop();
    for (var x = 0; x < grid.x; x++) {
        if (col == 0) {
            if (useBackground) fill(100, 150);
            else fill(100);
            col = 1;
        } else {
            if (useBackground) fill(200, 150);
            else fill(200);
            col = 0;
        }
        for (var y = 0; y < grid.y; y++) {
            if (col == 0) {
                if (useBackground) fill(100, 150);
                else fill(100);
                col = 1;
            } else {
                if (useBackground) fill(200, 150);
                else fill(200);
                col = 0;
            }
            noStroke();
            rect(x * gridSize + gridSize / 2 + centerOffsetX, y * gridSize + gridSize / 2 + centerOffsetY, gridSize, gridSize);
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
    if (keyCode == 83) {
        fastDrop = true;
    }

    if (keyCode == 65) {
        movement -= 1;
    }
    if (keyCode == 68) {
        movement += 1;
    }

    if (rotation != 0) {
        activePuyo.AddRotation(rotation, false);
    }
    if (movement != 0) {
        activePuyo.Move(movement);
    }
}

function keyReleased() {
    if (keyCode == 83) {
        fastDrop = false;
    }
}