const possibleFixables = require('./possibleFixables');

module.exports = function(seq, depth = 2) {
    const depth1_possibleFixables = possibleFixables(seq)
    console.log(depth1_possibleFixables);

    for (let i = 1; i < depth; i++) {
        let r = depth1_possibleFixables.flatMap(s => possibleFixables(s))
        depth1_possibleFixables.push(r)
    }
    console.log(depth1_possibleFixables);

    return depth1_possibleFixables;
}