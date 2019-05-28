class PuyoContainer {
    constructor() {
        this.speed = 1;
        this.chainLength = 2;
        this.puyos = [];
        this.rotation = 0;
        for (var i = 0; i < this.chainLength; i++) {
            this.puyos.push(new Puyo(this, this.speed, possibleColors, i));
        }
    }

    Update() {
        for (var i = 0; i < this.puyos.length; i++) {
            this.puyos[i].Collision();
            if (this.puyos[i].collision) {
                for (var j = 0; j < this.puyos.length; j++) {
                    this.puyos[j].dropped = true;
                }
            }
            this.puyos[i].Draw();
            this.puyos[i].Gravity();
        }
    }

    Move(dir) {
        for (var i = 0; i < this.puyos.length; i++) {
            if (!this.puyos[i].dropped) {
                this.puyos[i].x += gridSize * dir;
            } else {
                return;
            }
        }
    }

    AddRotation(dir) { // MODIFY TO CHECK FOR OTHER PUYOS THAT WOULD BLOCK ROTATION
        if (dir == 1) 
        {
            if (this.rotation == 0) this.RotateRight();
            else if (this.rotation == 1) this.RotateDown();
            else if (this.rotation == 2) this.RotateLeft();
            else if (this.rotation == 3) this.RotateUp();
        } else if (dir == -1) 
        {
            if (this.rotation == 0) this.RotateLeft();
            else if (this.rotation == 1) this.RotateUp();
            else if (this.rotation == 2) this.RotateRight();
            else if (this.rotation == 3) this.RotateDown();
        }
    }

    RotateUp() {
        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].y = this.puyos[0].y - gridSize;
        this.rotation = 0;
    }
    RotateRight() {
        if (this.puyos[0].x/gridSize == grid.x -1) {
            this.puyos[0].x-=gridSize;
        }
            this.puyos[1].x = this.puyos[0].x + gridSize;
            this.puyos[1].y = this.puyos[0].y;
            this.rotation = 1;
    }
    RotateDown() {
        this.puyos[1].x = this.puyos[0].x;
                this.puyos[1].y = this.puyos[0].y + gridSize;
                this.rotation = 2;
    }
    RotateLeft() {
        if (this.puyos[0].x/gridSize == 0) {
            this.puyos[0].x += gridSize;
        }
        this.puyos[1].x = this.puyos[0].x - gridSize;
        this.puyos[1].y = this.puyos[0].y;
        this.rotation = 3;
    }


}