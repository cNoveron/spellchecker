const fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const dictionary = require("../resources/dictionary.txt");

//This function first defines an array of vowels to use, and then loops through the input sequence and adds each vowel between consecutive pairs of letters. It then checks whether each resulting word can form a valid English word using the checkWord() function from my previous answer. The function returns true if at least one valid English word can be formed, and false otherwise.
module.exports = function(seq) {
    // Define an array of vowels to use
    const vowels = ["a", "e", "i", "o", "u"];

    const possibleFixes = []

    // Loop through the sequence and add each vowel between consecutive pairs of letters
    for (let i = -1; i < seq.length; i++) {
        for (const vowel of vowels) {
            const newWord = i == -1 
                ? vowel + seq
                : seq.slice(0, i + 1) + vowel + seq.slice(i + 1);
            regexString = `(\\s` + `${newWord}` + `\\s)`;
            regex = new RegExp(regexString, "dg");
            matches = dictionary.match(regex);

            if (matches !== null && matches !== []) {
                possibleFixes.push(newWord);
            }
        }
    }

    return possibleFixes;
}






