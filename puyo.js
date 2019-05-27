class Puyo {
    constructor(_speed, colors) {
        // Position
        this.x = 0;
        this.y = 0;
        this.x2 = this.x;
        this.y2 = this.y;
        // Size
        this.sizeX = 32;
        this.sizeY = 32;
        // Speed
        this.speed = _speed;
        // Color
        this.topColor = color(255,255,0);
        this.bottomColor = color(255,0,255);
        // Other
        this.dropped = false;
        this.rotation = 0;
        this.collision = false;
    }


    AddRotation(dir) {
        console.log(this.x);
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
        translate(this.x + this.sizeX/2, this.y);
        rotate(this.rotation);
        fill(this.topColor);
        rect(0, 0, this.sizeX, this.sizeY);
        fill(this.bottomColor);
        rect(0, this.sizeY, this.sizeX, this.sizeY);
        pop();
    }

    Move(dir) {
        if (!this.collsion) {
            this.x += gridSize * dir;
        }
    }

    Gravity() {
        if (!this.dropped) {
            this.y += this.sizeY/16;
        }

    }
    

    Collision() {
    }
}