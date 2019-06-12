var collisionMap = [];
var collisionLength = 0;
var collisionHeight = 0;

function initalizeCollisions(length, height) {
    // top left is 0 (1 outside on x)
    collisionMap = new Array(length*height);
    collisionLength = length;
    collisionHeight = height;
    for (var y = 0; y < collisionHeight; y++) {
        var line = "";
        for (var x = 0; x < collisionLength; x++) {
            if (x == 0) {
                collisionMap[collisionLength*y + x] = 1;
            }
            else if (x == length - 1) 
            {
                collisionMap[collisionLength*y + x] = 1;
            }
            else if (y == height - 1) {
                collisionMap[collisionLength*y + x] = 1;
            } else {
                collisionMap[collisionLength*y + x] = 0;
            }
            
            if (y == 0 && (x != 0 && x != collisionLength - 1)) {
                collisionMap[collisionLength*y + x] = 0;
            } 

            line += collisionMap[collisionLength*y + x] + " ";
        }
    }
}

function debugCollisions() {
    for (var y = 0; y < collisionHeight; y++) {
        var line = "";
        for (var x = 0; x < collisionLength; x++) {
            line += collisionMap[collisionLength*y + x] + " ";
        }
        console.log(line + ":" + y);
    }
}
