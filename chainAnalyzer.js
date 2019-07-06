class ChainAnalyzer {
    AnalyzeChains() {
        var removed = false; // true when at least one chain is removed

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
                    //console.log("ERROR: COULDN'T FIND CHAIN");
                    chains.push(new PuyoChain());
                    foundChain = chains.length - 1;
                    chains[foundChain].posArray.push(i);
                }
            } else if (puyoMatcher.matchRight || puyoMatcher.matchDown) {
                // A chain exists, but hasn't been created, so create a chain and store its position

                chains.push(new PuyoChain());
                foundChain = chains.length - 1;
                chains[foundChain].posArray.push(i);
                chains[foundChain].type = puyos[i].puyo.type;
            }
            if (puyoMatcher.matchRight) {
                chains[foundChain].posArray.push(i + 1);
            }
            if (puyoMatcher.matchDown) {
                chains[foundChain].posArray.push((i + grid.x));
            }
        }

        // Chain Combination
        chains = this.CombineChains(chains);

        console.log(chains);

        // Remove puyo chains of length > 4
        for (var i = 0; i < chains.length; i++) {
            if (chains[i].posArray.length >= chainLength) {
                removed = true;
                for (var j = 0; j < chains[i].posArray.length; j++) {
                    //console.log(puyos[chains[i].posArray[j]]);
                    if (puyos[chains[i].posArray[j]].puyo != null) {
                        puyos[chains[i].posArray[j]].puyo.drawable = false;
                        puyos[chains[i].posArray[j]].puyo.RemoveFromCollisionMap(true);
                    } else {
                        if (chains[i].posArray[j] == (grid.x * (round(activePuyo.puyos[0].y / gridSize) - 1) + round(activePuyo.puyos[0].x / gridSize) - 1)) {
                            activePuyo.puyos[0] == null;
                        }
                    }
                    puyos[chains[i].posArray[j]].puyo = null;
                    puyos[chains[i].posArray[j]].default = true;

                    //console.log("REMOVING");
                }
                temp = true;
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
                    console.log("%c Match Possible", "color: orange; font-weight: bold; font-size: 1.2em");
                    var finished = false;
                    for (var c = 0; c < chains[a].posArray.length; c++) {
                        for (var d = 0; d < chains[b].posArray.length; d++) {
                            if (chains[a].posArray[c] == chains[b].posArray[d]) { // The same puyo was found in both arrays, so combine them
                                console.log("%c Match Found", "color: red; font-weight: bold; font-size: 1.2em");
                                var newChain = new PuyoChain();
                                newChain.type = chains[a].type;
                                for (var i = 0; i < chains[a].posArray.length; i++) {
                                    newChain.posArray.push(chains[a].posArray[i]);
                                }
                                for (var i = 0; i < chains[b].posArray.length; i++) {
                                    newChain.posArray.push(chains[b].posArray[i]);
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

    FindChain(chains, i) {
        if (chains.length != 0) {
            for (var x = 0; x < chains.length; x++) {
                // Skip to the next chain if it is impossible for the puyo to be in this chain
                if (chains[x].type != puyos[i].puyo.type || chains[x].posArray.length == 0) continue;
                for (var y = 0; y < chains[x].posArray.length; y++) {
                    if (chains[x].posArray[y] == i) {
                        // Puyo was found
                        return x;
                    }
                }
            }
        }
        return -1;
    }

}