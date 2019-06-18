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
        this.posArray = [];
        this.type = -1;
    }
}
