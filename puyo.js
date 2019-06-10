class Puyo {
    constructor(parent, _speed, colors, pos) {
        this.parent = parent;
        this.pos = pos;

        // Position
        this.x = round((grid.x / 2 - 1) * gridSize);
        this.y = -gridSize;
        if (this.pos == 1) {
            this.y -= gridSize;
        }
        // Sizes
        this.sizeX = 32;
        this.sizeY = 32;
        // Speed
        this.speed = _speed;
        // Color
        this.color = random(colors);
        this.type = -1;
        for (var i = 0; i < colors.length; i++) {
            if (this.color == colors[i]) {
                this.type = i;
                break;
            }
        }
        // Match
        this.matcher = new Matcher(this);

        // Other
        this.dropped = false;
        this.rotation = 0;
        this.collision = false;
        this.inArray = false;
        this.puyoMap = null;
        this.inMap = false;
    }


    AddRotation(dir) {
        if (this.x == 0) {
            if ((this.rotation == 0 && dir == -1) || (this.rotation == -PI && dir == 1)) {
                return;
            }
        }
        this.rotation += -HALF_PI * dir;
        this.rotation %= 2 * PI;
    }

    Draw() {
        if (debug) {
            frameRate(5);
        } else{
            frameRate(60);
        }
        push(); // Settings for this puyo-puyo is contained
        rectMode(CENTER);
        translate(this.x + this.sizeX / 2, this.y);
        rotate(this.rotation);
        fill(this.color);
        rect(0, 0, this.sizeX, this.sizeY);
        pop();

//        if (this.dropped) {
//            this.matcher.FindMatch();
//        }
    }

    Gravity() {
        if (!this.collision) {
            this.y += (this.sizeY / 32) * this.speed;
        }

    }


    Collision() {
        // Looking for pre-emptive collision (one grid space before)
        if (collisionMap[collisionLength * (round(this.y / gridSize)) + (round(this.x / gridSize) + 1)] == 1) {
            this.collision = true;
        } else {
            this.collision = false;
            this.RemoveFromCollisionMap();
        }
    }

    AddToCollisionMap() {
        if (this.collision && !this.inMap) {
            //console.log("["+round(this.x/gridSize) + "," + round(this.y/gridSize) +"]");
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = 1;
            var color = 1;
            if (this.color == possibleColors[1]) color = 2;
            else if (this.color == possibleColors[2]) color = 3;
            else if (this.color == possibleColors[3]) color = 4;
            else if (this.color == possibleColors[4]) color = 5;
            if (!this.inArray) {
                this.puyoMap = new PuyoMap(round(this.x / gridSize), round(this.y / gridSize), this)
                var x = round(this.x / gridSize + 1) - 1;
                var y = round(this.y / gridSize) - 1;
                puyos[grid.x * y + x] = this.puyoMap;
                this.inArray = true;
            }
            this.inMap = true;
        }
    }

    RemoveFromCollisionMap() {
        if (!this.collision) {
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = 0;
            if (this.puyoMap != null) {
                for (var i = 0; i < puyos.length; i++) {
                    if (puyos[i].puyo == this) {
                        puyos[i].default = true;
                        puyos[i].puyo = null;
                        console.log("found");
                        break;
                    }
                }
                this.inArray = false;
            }
        }
    }
}