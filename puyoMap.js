var puyos = []

class PuyoMap {
    constructor(x, y, puyo, def = false) {
        this.x = x;
        this.y = y;
        this.puyo = puyo;
        this.default = def;
        this.id = random(10000,99999)
    }
}

function debugPuyos() {
    for (var y = 0; y < grid.y; y++) {
        var line = "";
        for (var x = 0; x < grid.x; x++) {
            if (puyos[grid.x*y + x].default == true) {
                line += "- ";
            } else {
                line += puyos[grid.x*y+x].puyo.type + " ";
            }
        }
        console.log(line + ":" + y);
    }
}

