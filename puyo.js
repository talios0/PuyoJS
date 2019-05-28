class Puyo {
    constructor(parent, _speed, colors, pos) {
        this.parent = parent;
        this.pos = pos;

        // Position
        this.x = 0;
        this.y = 0;
        if (this.pos == 1) {
            this.y-=gridSize;
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
        } else if (this.x / gridSize == 6) {
            console.log("TRUER THAN EVER BEFORE");
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
        //fill(this.bottomColor);
        //rect(0, this.sizeY, this.sizeX, this.sizeY);
        fill(0);
        rect(0,0,5,5);
        pop();
    }

    Gravity() {
        if (!this.dropped) {
            this.y += this.sizeY / 32;
        }

    }


    Collision() {
        // Looking for pre-emptive collision (one grid space before)
        if (collisionMap[collisionLength * (round(this.y/gridSize))  + (round(this.x/gridSize) +1)] == 1) {
            console.log("Collision at: [" + (round(this.x/gridSize) + 1) + "," + round(this.y/gridSize) + "]");
            this.collision = true;
        }
    }
}