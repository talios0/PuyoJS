class Puyo {
    constructor(parent, colors, host) {
        this.parent = parent; // The holding PuyoContainer

        // Position on grid (in terms of real units not grid units)
        this.x = round((grid.x / 2 - 1) * gridSize);
        this.y = -gridSize;
        if (host == 1) { // main puyo or not
            this.y -= gridSize;
        }
        // Sizes
        this.sizeX = 32;
        this.sizeY = 32;
        // Color
        this.color = random(colors);
        this.type = -1;
        for (var i = 0; i < colors.length; i++) {
            if (this.color == colors[i]) {
                this.type = i + 1;
                break;
            }
        }

        // The matcher class
        this.matcher = new Matcher(this);

        // Other
        this.dropped = false;
        this.rotation = 0;
        this.collision = false;
        this.posInPuyos = -1;

        // CollisionMap
        this.inMap = false;
        this.inTemp = false;
        this.posInTemp = -1;

        this.drawable = true;
    }

    Update() {
        //console.log("OFFICIAL");
        this.Collision();
        this.Gravity();
        this.Draw();
    }

    TempUpdate() {
        //console.log("TEMP");
        this.Gravity();
        this.Draw();
    }

    Draw() {
        if (this.drawable) {
        push();
        rectMode(CENTER);
        translate(this.x + this.sizeX / 2, this.y);
        rotate(this.rotation);
        fill(this.color);
        rect(0, 0, this.sizeX, this.sizeY);
        pop();
        }
    }

    Gravity() {
        if (this.collision) return;
        this.y += (this.sizeY / 32) * speed;
    }


    Collision() {
        if (collisionMap[collisionLength * (round(this.y / gridSize)) + (round(this.x / gridSize) + 1)] > 0) {
            this.collision = true;
            this.AddToCollisionMap();
        } else {
            this.collision = false;
            this.RemoveFromCollisionMap();
        }
    }

    AddToCollisionMap() {
        if (this.collision && !this.inMap) {
            // Add to collisionmap, specifying type
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = this.type;
            // Add to puyomap as a puyomap
            var x = round(this.x / gridSize + 1) - 1;
            var y = round(this.y / gridSize) - 1;
            puyos[grid.x * y + x] = new PuyoMap(round(this.x / gridSize), round(this.y / gridSize), this);
            this.posInPuyos = grid.x * y + x;
            puyos[this.posInPuyos].puyo = this;
            this.inMap = true;
        }
    }

    RemoveFromCollisionMap(force = false) {
        if ((!this.collision && this.inMap) || force)  {

            // Remove from collision map
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = 0;
            if (this.posInPuyos != -1) {
                puyos[this.posInPuyos].default = true;
                puyos[this.posInPuyos].puyo = null;
                this.posInPuyos = -1;
            }
            if (!force) {
                tempPuyos.push(this);
                this.inTemp = true;
                this.posInTemp = tempPuyos.length;
                if (this == activePuyo.puyos[0] || this == activePuyo.puyos[1]) {
                    //activePuyo.puyos.splice(this);
                    //this.drawable = false;
                }
            }
            this.inMap = false;
        }
    }
}