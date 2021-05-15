//// Each fallen puyo is stored inside a PuyoMap

var puyos = [];

class PuyoMap {
    constructor(x, y, puyo, def = false) {
        this.x = x;
        this.y = y;
        this.puyo = puyo;
        this.default = def;
    }
}

class PuyoChain {
    constructor() {
        this.posArray = new Set();
        this.type = -1;
    }
}
