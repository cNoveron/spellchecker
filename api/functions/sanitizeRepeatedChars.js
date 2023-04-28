const _ = require('lodash');

module.exports = function (word) {

    let reps = {
        "a": 1,
        "b": 2,
        "c": 2,
        "d": 2,
        "e": 2,
        "f": 2,
        "g": 2,
        "h": 1,
        "i": 1,
        "j": 2,
        "k": 1,
        "l": 2,
        "m": 2,
        "n": 2,
        "o": 2,
        "p": 2,
        "q": 1,
        "r": 1,
        "s": 2,
        "t": 2,
        "u": 1,
        "v": 1,
        "w": 1,
        "x": 1,
        "y": 1,
        "z": 2
    }
    let repetition_regexStringsAndFixers = Object.entries(reps)
        .map(e => [
            new RegExp(`${e[0]}{${e[1]+1},}`,'gi'),
            (acc, curr) => acc.replace(curr, e[0].repeat(e[1]))
        ])
    let [repetition_regexStrings, repetition_Fixers] = _.unzip(repetition_regexStringsAndFixers)
    let repetition_matches = repetition_regexStrings.map(e => word.match(e))

    r = _.zip(repetition_matches, repetition_Fixers)
    r = r.filter(e => e[0] !== null)
    r = r.reduce((acc, curr) => 
        curr[0] === null 
            ? null 
            : curr[0].reduce(curr[1], acc), 
        word
    )
    console.log(r);
    
    return r
}