const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
const dictionary = require("../resources/dictionary.txt");



//This function first defines an array of vowels to use, and then loops through the input sequence and adds each vowel between consecutive pairs of letters. It then checks whether each resulting word can form a valid English word using the checkWord() function from my previous answer. The function returns true if at least one valid English word can be formed, and false otherwise.
module.exports = function(seq) {
    // Define an array of vowels to use
    const vowels = ["a", "e", "i", "o", "u"];

    let possibleFixables = []

    // Loop through the sequence and add each vowel between consecutive pairs of letters
    for (let i = -1; i < seq.length; i++) {
        for (const vowel of vowels) {
            const newWord = i == -1 
                ? vowel + seq
                : seq.slice(0,i+1) + vowel + seq.slice(i+1);
            const fragment = i < 1
                ? newWord.slice(0,5)
                : newWord.slice(i-1,i+4);

            if (fragment.length < 4)
                continue;

            regexString = seq.length < 5
                ? `\\b${fragment}|\\b\\B${fragment}|${fragment}\\B\\b|${fragment}\\b`
                : i < 2
                    ? `${fragment}\\B|${fragment}\\b|${fragment.slice(0,i+3)}\\B`
                    : seq.length-4 < i
                        ? `\\B${fragment}|\\b${fragment}|\\B${fragment.slice(i,i+4)}`
                        : `\\B${fragment}\\B`;


            regex = new RegExp(regexString, "g");
            matches = dictionary.match(regex);

            if (matches !== null && matches !== []) {
                possibleFixables.push(newWord);
            }
        }
    }

    return possibleFixables;
}






