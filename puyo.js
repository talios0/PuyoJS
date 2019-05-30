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
        // Size
        this.sizeX = 32;
        this.sizeY = 32;
        // Speed
        this.speed = _speed;
        // Color
        this.color = random(colors)
        // Other
        this.dropped = false;
        this.rotation = 0;
        this.collision = false;
        this.update = true;
        this.inArray = false;
        this.puyoMap = null;
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
        if (this.update) {
            push(); // Settings for this puyo-puyo is contained
            rectMode(CENTER);
            translate(this.x + this.sizeX / 2, this.y);
            rotate(this.rotation);
            fill(this.color);
            rect(0, 0, this.sizeX, this.sizeY);
            pop();
        }
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
        if (this.collision) {
            //console.log("["+round(this.x/gridSize) + "," + round(this.y/gridSize) +"]");
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = 1;
            var color = 1;
            if (this.color == possibleColors[1]) color = 2;
            else if (this.color == possibleColors[2]) color = 3;
            else if (this.color == possibleColors[3]) color = 4;
            else if (this.color == possibleColors[4]) color = 5;
            if (!this.inArray) {
                this.puyoMap = new PuyoMap(round(this.x / gridSize), round(this.y / gridSize), this)
                puyos.push(this.puyoMap);
                this.inArray = true;
            }
        }
    }

    RemoveFromCollisionMap() {
        if (!this.collision) {
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = 0;
            if (this.puyoMap != null) {
                console.log(puyos.find(this.puyoMap));
                //puyos.splice(puyos[puyos.find(this.puyoMap)]);
                this.inArray = false;
            }
        }
    }
}