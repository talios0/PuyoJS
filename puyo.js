class Puyo {
    constructor(parent, _speed, colors, pos) {
        this.parent = parent;
        this.pos = pos;

        // Position
        this.x = round((grid.x/2 -1)* gridSize) ;
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
        push(); // Settings for this puyo-puyo is contained
        rectMode(CENTER);
        translate(this.x + this.sizeX / 2, this.y);
        rotate(this.rotation);
        fill(this.color);
        rect(0, 0, this.sizeX, this.sizeY);
        pop();
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
            collisionMap[(round(this.y/gridSize) - 1)*collisionLength + (round(this.x/gridSize) + 1)] = 1;
        }
    }

    RemoveFromCollisionMap() {
        if (!this.collision) {
            collisionMap[(round(this.y/gridSize) - 1)*collisionLength + (round(this.x/gridSize) + 1)] = 0;
        }
    }
}