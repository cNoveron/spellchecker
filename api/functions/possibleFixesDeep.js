const _ = require('lodash');
const possibleFixes = require('./possibleFixes');

module.exports = function(seq, depth = 1) {
    let depth1_possibleFixes = possibleFixes(seq)
    // console.log(depth1_possibleFixes);
    // console.log('-------');

    for (let i = 1; i < depth; i++) {
        let r = depth1_possibleFixes.flatMap(s => possibleFixes(s))
        // console.log(r);
        depth1_possibleFixes = _.union(depth1_possibleFixes, r)
        // console.log(depth1_possibleFixes);
    }

    return depth1_possibleFixes;
}