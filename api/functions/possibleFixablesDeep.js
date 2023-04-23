const _ = require('lodash');
const possibleFixables = require('./possibleFixables');

module.exports = function(seq, depth = 1) {
    let depth1_possibleFixables = possibleFixables(seq)

    for (let i = 1; i < depth; i++) {
        let r = depth1_possibleFixables.flatMap(s => possibleFixables(s))
        // console.log(r);
        depth1_possibleFixables = _.union(depth1_possibleFixables, r)
        // console.log(depth1_possibleFixables);
    }

    return depth1_possibleFixables;
}