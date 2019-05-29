class PuyoContainer {
    constructor() {
        this.speed = 2;
        this.chainLength = 2;
        this.puyos = [];
        this.rotation = 0;
        this.dropped = false;
        for (var i = 0; i < this.chainLength; i++) {
            this.puyos.push(new Puyo(this, this.speed, possibleColors, i));
        }
    }

    Update() {
        for (var i = 0; i < this.puyos.length; i++) {
            this.puyos[i].Collision();
            if (this.puyos[i].collision && !this.dropped) {
                this.dropped = true;
                for (var j = 0; j < this.puyos.length; j++) {
                    this.puyos[j].dropped = true;
                    this.puyos[j].x = round(this.puyos[j].x/gridSize) * gridSize;
                    this.puyos[j].y = round(this.puyos[j].y/gridSize) * gridSize - 0.5*gridSize;
                }
            }
            this.puyos[i].AddToCollisionMap();
            this.puyos[i].Draw();
            this.puyos[i].Gravity();
        }
    }

    Move(dir) {
        if (this.dropped) return;
        for (var i = 0; i < this.puyos.length; i++) {
            if (collisionMap[collisionLength*(round((this.puyos[i].y/gridSize)+0.5) - 1)+ (round(this.puyos[i].x/gridSize)+ 1) + dir] == 1) return;
        }
        for (var i = 0; i < this.puyos.length; i++) {
            this.puyos[i].x += gridSize * dir;
        }
    }

    AddRotation(dir, final) { // MODIFY TO CHECK FOR OTHER PUYOS THAT WOULD BLOCK ROTATION
        if (dir == 1) {
            if (this.rotation == 0) this.RotateRight(dir, final);
            else if (this.rotation == 1) this.RotateDown(dir, final);
            else if (this.rotation == 2) this.RotateLeft(dir, final);
            else if (this.rotation == 3) this.RotateUp(dir, final); 
        } else if (dir == -1) {
            if (this.rotation == 0) this.RotateLeft(dir, final);
            else if (this.rotation == 1) this.RotateUp(dir, final);
            else if (this.rotation == 2) this.RotateRight(dir, final);
            else if (this.rotation == 3) this.RotateDown(dir, final);
        }
    }

    RotateUp(dir, final) {
        this.rotation = 0;
        if (collisionMap[collisionLength*(round((this.puyos[0].y/gridSize)+0.5) - 1)+ (round(this.puyos[0].x/gridSize)+ 1) - collisionLength] == 1) { // This shouldn't be possible
            if (final) return;
            this.AddRotation(dir, true);
            return;
        }
        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].y = this.puyos[0].y - gridSize;

    }
    RotateRight(dir, final) {
        this.rotation = 1;
        if (collisionMap[collisionLength*(round((this.puyos[0].y/gridSize)+0.5) - 1)+ (round(this.puyos[0].x/gridSize)+ 1) + 1] == 1) {
            if (collisionMap[collisionLength*(round((this.puyos[0].y/gridSize)+0.5) - 1)+ (round(this.puyos[0].x/gridSize)+ 1) - 1] == 1) {
                if (final) return;
                this.AddRotation(dir, true);
                return;
            }
            this.puyos[0].x -= gridSize;
        }
        this.puyos[1].x = this.puyos[0].x + gridSize;
        this.puyos[1].y = this.puyos[0].y;
    }
    RotateDown(dir, final) {
        this.rotation = 2;
        if (collisionMap[collisionLength*(round((this.puyos[0].y/gridSize)+0.5) - 1)+ (round(this.puyos[0].x/gridSize)+ 1) + collisionLength] == 1) {
            this.puyos[0].y -= gridSize;
        }

        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].y = this.puyos[0].y + gridSize;
    }
    RotateLeft(dir, final) {
        this.rotation = 3;
        if (collisionMap[collisionLength*(round((this.puyos[0].y/gridSize)+0.5) - 1)+ (round(this.puyos[0].x/gridSize)+ 1) - 1] == 1) {
            if (collisionMap[collisionLength*(round((this.puyos[0].y/gridSize)+0.5) - 1)+ (round(this.puyos[0].x/gridSize)+ 1) + 1] == 1) {
                if (final) return;
                this.AddRotation(dir, true);
                return;
            }
            this.puyos[0].x += gridSize;
        }
        this.puyos[1].x = this.puyos[0].x - gridSize;
        this.puyos[1].y = this.puyos[0].y;
    }


}