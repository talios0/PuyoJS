//// Used to manage the actively falling Puyo pair

class PuyoContainer {
    constructor() {
        this.puyos = []; // List of the falling puyos
        this.rotation = 0; // Current rotation
        this.status = 0;
        this.fastDropMultiplier = 3;
        for (var i = 0; i < 2; i++) {
            this.puyos.push(new Puyo(this, i));
        }
        this.puyos[0].CheckSprite();
        this.puyos[1].CheckSprite();
    }

    Update() {
        // Update the status of the collisions
        for (var i = 0; i < this.puyos.length; i++) {
            if (!this.puyos[i].drawable) continue;
            if (this.puyos[i].collision) { // Snap to nearest tile if in collision
               
            } 
            //this.puyos[i].AddToCollisionMap(); // Add to the collision map
            this.puyos[i].Update();
        }

        if ((this.puyos[0].collision || !this.puyos[0].drawable) && (this.puyos[1].collision || !this.puyos[1].drawable)) this.status = 2;
        else if ((this.puyos[0].collision || !this.puyos[0].drawable) || (this.puyos[1].collision || !this.puyos[1].drawable)) this.status = 1;
    }

    Move(dir) { // Moves the active puyo group across the grid (left-right)
        if (this.status > 0) return;
        for (var i = 0; i < this.puyos.length; i++) {
            // Check if there is a collision in the desired direction
            var pos = gamePosToGridPos(this.puyos[i]);
            if (checkCollision(pos[1], pos[0] + dir)) return;
            //if (collisionMap[collisionLength * (round((this.puyos[i].y / gridSize) + 0.5) - 1) + (round(this.puyos[i].x / gridSize) + 1) + dir] > 0) return;
        }
        for (var i = 0; i < this.puyos.length; i++) {
            this.puyos[i].x += gridSize * dir;
            this.puyos[i].gridX += dir;
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
        this.puyos[0].CheckSprite();
        this.puyos[1].CheckSprite();
    }
    RotateUp(dir, final) {
        this.rotation = 0;
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) - collisionLength] > 0) { // This shouldn't be possible
            if (final) return;
            this.AddRotation(dir, true);
            return;
        }
        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].gridX = this.puyos[0].gridX;
        this.puyos[1].y = this.puyos[0].y - gridSize;
        this.puyos[1].gridY = this.puyos[0].gridY - 1;

    }
    RotateRight(dir, final) {
        this.rotation = 1;
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) + 1] > 0) {
            if (collisionMap[collisionLength * (round((this.puyos[1].y / gridSize) + 0.5) - 1) + (round(this.puyos[1].x / gridSize) + 1) - 1] > 0) {
                if (final) return;
                this.AddRotation(dir, true);
                return;
            }
            this.puyos[0].x -= gridSize;
            this.puyos[0].gridX--;
        }
        this.puyos[1].x = this.puyos[0].x + gridSize;
        this.puyos[1].y = this.puyos[0].y;
        this.puyos[1].gridX = this.puyos[0].gridX + 1;
        this.puyos[1].gridY = this.puyos[0].gridY;
    }
    RotateDown(dir, final) {
        this.rotation = 2;
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) + collisionLength] > 0) {
            this.puyos[0].y -= gridSize;
            this.puyos[0].gridY--;
        }

        this.puyos[1].x = this.puyos[0].x;
        this.puyos[1].y = this.puyos[0].y + gridSize;
        this.puyos[1].gridX = this.puyos[0].gridX;
        this.puyos[1].gridY = this.puyos[0].gridY+1;
    }   
    RotateLeft(dir, final) {
        this.rotation = 3;
        if (collisionMap[collisionLength * (round((this.puyos[0].y / gridSize) + 0.5) - 1) + (round(this.puyos[0].x / gridSize) + 1) - 1] > 0) {
            if (collisionMap[collisionLength * (round((this.puyos[1].y / gridSize) + 0.5) - 1) + (round(this.puyos[1].x / gridSize) + 1) + 1] > 0) {
                if (final) return;
                this.AddRotation(dir, true);
                return;
            }
            this.puyos[0].x += gridSize;
            this.puyos[0].gridX++;
        }
        this.puyos[1].x = this.puyos[0].x - gridSize;
        this.puyos[1].y = this.puyos[0].y;
        this.puyos[1].gridX = this.puyos[0].gridX - 1;
        this.puyos[1].gridY = this.puyos[0].gridY;
    }


}