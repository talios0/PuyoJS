class PuyoContainer {
    constructor() {
        this.puyos = []; // List of the falling puyos
        this.rotation = 0; // Current rotation
        this.status = 0;
        for (var i = 0; i < 2; i++) {
            this.puyos.push(new Puyo(this, possibleColors, i));
        }
    }

    Update() {
        // Update the status of the collisions
        for (var i = 0; i < this.puyos.length; i++) this.puyos[i].Collision();

        if ((this.puyos[0].collision || !this.puyos[0].drawable) && (this.puyos[1].collision || !this.puyos[1].drawable)) this.status = 2;
        else if ((this.puyos[0].collision || !this.puyos[0].drawable) || (this.puyos[1].collision || !this.puyos[1].drawable)) this.status = 1;

        for (var i = 0; i < this.puyos.length; i++) {
            if (!this.puyos[i].drawable) continue;
            if (this.puyos[i].collision) { // Snap to nearest tile if in collision
                this.puyos[i].x = round(this.puyos[i].x / gridSize) * gridSize;
                this.puyos[i].y = round(this.puyos[i].y / gridSize) * gridSize - 0.5 * gridSize;
            } 
            //this.puyos[i].AddToCollisionMap(); // Add to the collision map
            this.puyos[i].Update();
        }
    }

    Move(dir) {
        if (this.status > 0) return;
        for (var i = 0; i < this.puyos.length; i++) {
            if (collisionMap[collisionLength * (round((this.puyos[i].y / gridSize) + 0.5) - 1) + (round(this.puyos[i].x / gridSize) + 1) + dir] > 0) return;
        }
        for (var i = 0; i < this.puyos.length; i++) {
            this.puyos[i].x += gridSize * dir;
        }
    }

    AddRotation(dir, final) {
        if (this.status > 0) return;
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
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) - collisionLength] == 1) { // This shouldn't be possible
            if (final) return;
            this.AddRotation(dir, true);
            return;
        }
        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].y = this.puyos[0].y - gridSize;

    }
    RotateRight(dir, final) {
        this.rotation = 1;
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) + 1] == 1) {
            if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) - 1] == 1) {
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
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) + collisionLength] == 1) {
            this.puyos[0].y -= gridSize;
        }

        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].y = this.puyos[0].y + gridSize;
    }
    RotateLeft(dir, final) {
        this.rotation = 3;
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) - 1] == 1) {
            if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) + 1] == 1) {
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