class Matcher {
    constructor(puyo) {
        this.puyo = puyo;
        this.matchLeft = false;
        this.matchRight = false;
        this.matchUp = false;
        this.matchDown = false;
        this.filled = false;
        this.redo = true;
    }

    FindMatch() {
        if (this.redo) this.ClearMatch();
        if (this.filled) return;

        var x = round(this.puyo.x/gridSize);
        var y = round(this.puyo.y/gridSize) - 1;

        // Left
        if (!this.matchLeft && x != 0) {
            var puyo = puyos[(grid.x * y + x) - 1];
            if (!puyo.default)
                if (this.puyo.type == puyo.puyo.type) this.matchLeft = true;
        }
        // Right
        if (!this.matchRight && x + 1 != grid.x) {
            var puyo = puyos[(grid.x * y + x) + 1];
            if (!puyo.default)
                if (this.puyo.type == puyo.puyo.type) this.matchRight = true;
        }
        // Up
        if (!this.matchUp && y != 0) {
            var puyo = puyos[(grid.x * y + x) - grid.x];
            if (!puyo.default) 
                if (this.puyo.type == puyo.puyo.type) this.matchUp = true;
        }
        // Down
        if (!this.matchDown && round(y / gridSize) != grid.y) {
            var puyo = puyos[(grid.x * (round(y / gridSize) - 1) + round(x / gridSize)) + grid.x];
            if (!puyo.default)
                if (this.puyo.type == puyo.puyo.type) this.matchDown = true;
        }
    }

    DebugMatch() {
        if (this.matchLeft || this.matchRight || this.matchDown || this.matchUp) {
            console.log(this.matchLeft);
            console.log(this.matchRight);
            console.log(this.matchDown);
            console.log(this.matchUp);
            console.log("---");
        }
    }

    AnalyzeChain() {

    }


    ClearMatch() {
        this.redo = false;
        this.filled = false;
        this.matchLeft = false;
        this.matchRight = false;
        this.matchUp = false;
        this.matchDown = false;
    }
}