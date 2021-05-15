class ChainAnalyzer {
    constructor() {
        this.chainInterupt = false;
        this.chainDelay = 50;
        this.frameCounter = 0;
        this.frameBlink = 0;
        // Basically I haven't worked on this project in months and I should replace this with a set
        // and it's callers to work without random access through [], but I won't, which is less performant.
        this.chains = [];
    }

    AnalyzeChains() {
        var chains = [];
        for (var i = 0; i < puyos.length; i++) {
            if (puyos[i].default || !puyos[i].puyo.drawable) continue; // Go to the next if the current puyo doesn't exist
            var puyoMatcher = puyos[i].puyo.matcher; // Reference for matcher
            puyoMatcher.FindMatch(); // Find match
            var foundChain = -1; // Index of chain in chains[]
            if (puyoMatcher.matchLeft || puyoMatcher.matchUp) {
                // Chain already started, so find and store it
                foundChain = this.FindChain(chains, i);
                if (foundChain == -1) {
                    chains.push(new PuyoChain());
                    foundChain = chains.length - 1;
                    chains[foundChain].posArray.add(i);
                }
            } else if (puyoMatcher.matchRight || puyoMatcher.matchDown) {
                // A chain exists, but hasn't been created, so create a chain and store its position
                chains.push(new PuyoChain());
                foundChain = chains.length - 1;
                chains[foundChain].posArray.add(i);
                chains[foundChain].type = puyos[i].puyo.type;
            }
            if (puyoMatcher.matchRight) {
                chains[foundChain].posArray.add(i + 1);
            }
            if (puyoMatcher.matchDown) {
                chains[foundChain].posArray.add((i + grid.x));
            }
        }

        // Chain Combination
        this.chains = this.RemoveShortChains(this.CombineChains(chains));
    
        // Blink then remove puyo chains of length > 4
        this.chainInterupt = true;

        // Remove duplicates from chain in a non-optimal manner
        //this.chains = [new Set(this.chains)];
    }

    PrepareChainDestroy() {
        if (this.chainInterupt && this.chainDelay == this.frameCounter) {
            this.DestroyChains();
            this.chains = [];
            this.chainInterupt = false;
            this.frameCounter = 0;
            return;
        }
        this.frameCounter++;
        this.BlinkChains();
    }

    BlinkChains() {
        for (var i = 0; i < this.chains.length; i++) { // Loops through each chain
            for (let pos of this.chains[i].posArray.values()) { // Loops through each puyo
                if (this.frameBlink == 0) {
                    puyos[pos].puyo.drawable = !puyos[pos].puyo.drawable;
                }
            }
        }
        this.frameBlink++;
        if (this.frameBlink > 5) this.frameBlink = 0;
    }

    DestroyChains() {
        //console.log("REMOVING");
        var removed = false; // True when at least one chain is removed
        for (var i = 0; i < this.chains.length; i++) {
            if (this.chains[i].posArray.size >= chainLength) {
                removed = true;
                for (var j of this.chains[i].posArray.values()) {
                    //console.log(puyos[j]);
                    if (puyos[j].puyo != null) {
                        puyos[j].puyo.drawable = false;
                        puyos[j].puyo.RemoveFromCollisionMap(true);
                    } else {
                        if (j == (grid.x * (round(activePuyo.puyos[0].y / gridSize) - 1) + round(activePuyo.puyos[0].x / gridSize) - 1)) {
                            activePuyo.puyos[0] == null;
                        }
                    }
                    puyos[j].puyo = null;
                    puyos[j].default = true;

                    //console.log("REMOVING");
                }
            }
        }

        if (removed) {
            for (var i = 0; i < puyos.length; i++) {
                if (puyos[i].default) continue;
                puyos[i].puyo.matcher.redo = true;
            }
        }
    }

    CombineChains(chains) {
        var chainSize = chains.length;
        for (var a = 0; a < chainSize; a++) {
            for (var b = 0; b < chainSize; b++) {
                if (a >= b) continue; // The same check has already occurred, except a and b were swapped/they are the same chain 
                if (chains[a].type == chains[b].type) { // Type is the same, so check for overlap
                    //console.log("%c Match Possible", "color: orange; font-weight: bold; font-size: 1.2em");
                    var finished = false;
                    for (var c of chains[a].posArray.values()) {
                        for (var d of chains[b].posArray.values()) {
                            if (c == d) { // The same puyo was found in both arrays, so combine them
                                //console.log("%c Match Found", "color: red; font-weight: bold; font-size: 1.2em");
                                var newChain = new PuyoChain();
                                newChain.type = chains[a].type;
                                for (var i of chains[a].posArray.values()) {
                                    newChain.posArray.add(i);
                                }
                                for (var i of chains[b].posArray.values()) {
                                    var duplicate = false;
                                    for (var z of newChain.posArray.values()) {
                                        if (z != i) continue;
                                        duplicate = true;
                                        break;
                                    }
                                    if (!duplicate) newChain.posArray.add(i);
                                }

                                chains.push(newChain);
                                finished = true;
                            }
                            if (finished) break;
                        }
                        if (finished) break;
                    }
                }
            }
        }
        return chains;
    }

    RemoveShortChains(chains) {
        var newChains = [];
        for (var i = 0; i < chains.length; i++) {
            //console.log(chains[i].posArray.size);
            if (chains[i].posArray.size < chainLength) continue;
            newChains.push(chains[i]);
        }
        return newChains;
    }

    FindChain(chains, i) {
        if (chains.length != 0) {
            for (var x = 0; x < chains.length; x++) {
                // Skip to the next chain if it is impossible for the puyo to be in this chain
                if (chains[x].type != puyos[i].puyo.type || chains[x].posArray.length == 0) continue;
                for (var y of chains[x].posArray.values()) {
                    if (y == i) {
                        // Puyo was found
                        return x;
                    }
                }
            }
        }
        return -1;
    }

}