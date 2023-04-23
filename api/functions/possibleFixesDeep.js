const possibleFixes = require('./possibleFixes');

module.exports = function(seq, depth = 2) {
    const depth1_possibleFixes = possibleFixes(seq)

    for (let i = 1; i < depth; i++) {
        let r = depth1_possibleFixes.flatMap(s => possibleFixes(s))
        depth1_possibleFixes.push(r)
    }

    return depth1_possibleFixes;
}