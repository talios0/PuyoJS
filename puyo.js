class Puyo {
    constructor(parent, host) {
        this.parent = parent; // The holding PuyoContainer

        // Position on grid (in terms of real units not grid units)
        this.x = round((grid.x / 2 - 1) * gridSize);
        this.y = -gridSize;
        this.host = true;
        if (host == 1) { // main puyo or not
            this.host = false;
            this.y = parent.puyos[0].y - gridSize;
        }

        // Sizes
        this.sizeX = gridSize;
        this.sizeY = gridSize;

        // Color
        this.color = random(puyoColors);

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
        this.fastDropMultiplier = 3;
        this.active = true;
        this.countdown = true;
        this.frameCounter = 0;

        this.temp = false;
        if (!this.host && tempTest) {
            this.temp = true;
            tempTest = false;
        } 

        // Base Sprite, updated in this.CheckSprite()
        this.sprite;// = puyoSpriteSheet.get(0,0,puyoSize,puyoSize);
    }

    Update() {
        this.Gravity();
        this.Collision();
        this.CollisionDelay();
        //this.CheckSprite();
        this.Draw();
    }


    Draw() {
        if (this.drawable) {
            push();
            rectMode(CENTER);
            imageMode(CENTER);
            translate(this.x + this.sizeX / 2 + centerOffsetX, this.y + centerOffsetY);
            rotate(this.rotation);
            fill(this.color);
            image(this.sprite, 0, 0, this.sizeX, this.sizeY);
            //rect(0, 0, this.sizeX, this.sizeY);
            pop();
        }
    }

    Gravity() {

        if (this.collision || this.inMap) return;
        if (!this.dropped && this.countdown) return;
        if (((!this.parent.puyos[1].dropped && this.parent.puyos[1].countdown) || (!this.parent.puyos[0].dropped && this.parent.puyos[0].countdown))) {
            if (this.temp) console.log("stop");
            if (this.parent.rotation == 1 || this.parent.rotation == 3 || (this.parent.rotation == 0 && this.host) || (this.parent.rotation == 2 && !this.host)) return;
            if (this.host && this.parent.puyos[1].frameCounter > 0) return;
            else if (this.parent.puyos[0].frameCounter > 0) return;
        }
        if (fastDrop && this.active && this.parent.status == 0) {      if (this.temp) console.log(this.y); this.y += (this.sizeY / 32) * speed * this.fastDropMultiplier; }
        else {
        if (this.temp) console.log(this.y);this.y += (this.sizeY / 32) * speed; }
    }

    CheckSprite() {
        // Check if the puyo is currently active
        if (!this.dropped) {
            if (this.host) {
                var otherPuyo = this.parent.puyos[1];
                if (otherPuyo.color != this.color) {
                    this.sprite = puyoSpriteSheet.get(0, puyoSize*this.color, puyoSize, puyoSize);
                    return;
                }

                // Rotation
                if (this.parent.rotation == 0) {
                    this.sprite = puyoSpriteSheet.get(2*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                } 
                else if (this.parent.rotation == 1) {
                    this.sprite = puyoSpriteSheet.get(4*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
                else if (this.parent.rotation == 2) {
                    this.sprite = puyoSpriteSheet.get(1*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
                else {
                    this.sprite = puyoSpriteSheet.get(8*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
            }
            else {
                var otherPuyo = this.parent.puyos[0];
                if (otherPuyo.color != this.color) {
                    this.sprite = puyoSpriteSheet.get(0, puyoSize*this.color, puyoSize, puyoSize);
                    return;
                }

                // Rotation
                if (this.parent.rotation == 0) {
                    this.sprite = puyoSpriteSheet.get(1*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                } 
                else if (this.parent.rotation == 1) {
                    this.sprite = puyoSpriteSheet.get(8*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
                else if (this.parent.rotation == 2) {
                    this.sprite = puyoSpriteSheet.get(2*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
                else {
                    this.sprite = puyoSpriteSheet.get(4*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
            }
        }

        else {
            if (this.matcher.matchLeft) {
                if (this.matcher.matchDown) {
                    if (this.matcher.matchRight) {
                        if (this.matcher.matchUp) {
                            // Left, Down, Right, Up Match
                            this.sprite = puyoSpriteSheet.get(15*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                        } else {
                            // Left, Down, Right Match
                            this.sprite = puyoSpriteSheet.get(13*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                        }
                    } else if (this.matcher.matchUp) {
                        // Left, Down, Up Match
                        this.sprite = puyoSpriteSheet.get(11*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                    } else {
                        // Left and Down Match
                        this.sprite = puyoSpriteSheet.get(9*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                    }
                } else if (this.matcher.matchRight) {
                    if (this.matcher.matchUp) {
                        // Left, Right, Up Match
                        this.sprite = puyoSpriteSheet.get(14*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                    } else {
                        // Left and Right Match
                        this.sprite = puyoSpriteSheet.get(12*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                    }
                } else if (this.matcher.matchUp) {
                    // Left and Up Match
                    this.sprite = puyoSpriteSheet.get(10*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                } else {
                    // Left Match
                    this.sprite = puyoSpriteSheet.get(8*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
            }
            else if (this.matcher.matchDown) {
                if (this.matcher.matchRight) {
                    if (this.matcher.matchUp) {
                        // Down, Right, Up Match
                        this.sprite = puyoSpriteSheet.get(7*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                    } else {
                        // Down and Right Match
                        this.sprite = puyoSpriteSheet.get(5*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                    }
                } else if (this.matcher.matchUp) {
                    // Down and Up Match
                    this.sprite = puyoSpriteSheet.get(3*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                } else {
                    // Down Match
                    this.sprite = puyoSpriteSheet.get(1*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
            } 
            else if (this.matcher.matchRight) {
                if (this.matcher.matchUp) {
                    // Right and Up Match
                    this.sprite = puyoSpriteSheet.get(6*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                } else {
                    // Right Match
                    this.sprite = puyoSpriteSheet.get(4*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
                }
            } 
            else if (this.matcher.matchUp) {
                // Up Match
                this.sprite = puyoSpriteSheet.get(2*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
            }
            else {
                // No Match
                this.sprite = puyoSpriteSheet.get(0*puyoSize, puyoSize*this.color, puyoSize, puyoSize);
            }
        }
    }


    Collision() {
        if (collisionMap[collisionLength * (round(this.y / gridSize)) + (round(this.x / gridSize) + 1)] > -1) {
            if (!this.dropped || !this.countdown) { this.countdown = true; return; }
            this.collision = true;
            this.AddToCollisionMap();
        } else {
            if (!this.dropped) {
                this.countdown = false;
            }
            if (this.collision) {
                this.collision = false;
                this.RemoveFromCollisionMap();
            }
        }
    }

    CollisionDelay() {
        if (!this.countdown) return;
        if (this.frameCounter >= lockInFrames || (this != this.parent.puyos[0] && this.parent.puyos[0].dropped && this.parent.puyos[0].collision) || (this != this.parent.puyos[1] && this.parent.puyos[1].dropped && this.parent.puyos[1].collision)) {
            this.frameCounter = 0;
            this.dropped = true;
            this.countdown = true;
            this.Collision();
        }
        else {
            this.frameCounter++;
        }
    }

    AddToCollisionMap() {
        if (this.collision && !this.inMap) {
            // Add to collisionmap, specifying type
            var x = round(this.x / gridSize + 1) - 1;
            var y = round(this.y / gridSize) - 1;
            addCollision(y, x, this.color);
            //collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = this.color;
            // Add to puyomap as a puyomap
            puyos[grid.x * y + x] = new PuyoMap(round(this.x / gridSize), round(this.y / gridSize), this);
            this.posInPuyos = grid.x * y + x;
            puyos[this.posInPuyos].puyo = this;
            this.inMap = true;
            //console.log("Added " + this.color + " on COL: " + x + " ROW: " + y);
        }
    }

    RemoveFromCollisionMap(force = false) {
        if ((!this.collision && this.inMap) || force) {
            // Remove from collision map
            collisionMap[(round(this.y / gridSize) - 1) * collisionLength + (round(this.x / gridSize) + 1)] = -1;
            if (this.posInPuyos != -1) {
                puyos[this.posInPuyos].default = true;
                puyos[this.posInPuyos].puyo = null;
                this.posInPuyos = -1;
            }
            if (!force) {
                if (activePuyo != this.parent) {
                    tempPuyos.push(this);
                    this.inTemp = true;
                    this.posInTemp = tempPuyos.length;
                }
            }
            this.inMap = false;
            tempPuyosExisted = true;
        }
    }
}