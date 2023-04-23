const User = require('../models/User');
const sanitizeRepeatedChars = require('../functions/sanitizeRepeatedChars');
const possibleFixesDeep = require('../functions/possibleFixesDeep');

const fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const dictionary = require("../resources/dictionary.txt");

const SpellcheckController = () => {
  const spellcheck = async (req, res) => {
    const { word } = req.params;

    try {
      let failed, initialMatches, regexString, regex

      if (word.length < 1) failed = true;
      
      regexString = `(\\s` + `${word}` + `\\s)`;
      regex = new RegExp(regexString, "dg");
      // console.log(regex);
      
      initialMatches = dictionary.match(regex);
      // console.log(initialMatches);
      if (initialMatches !== null && initialMatches !== []) {
        if (initialMatches.length === 1)
          return res.status(200).json({ suggestions: [], correct: true });
      }
      else {

        let withoutRepeatedChars = sanitizeRepeatedChars(word)
        let caseCorrected = withoutRepeatedChars.toLowerCase()
        let possibleFixes = possibleFixesDeep(caseCorrected, 2)

        return res.status(200).json({ suggestions: possibleFixes, correct: false });

        // for (let index = word.length; 1 < word.length; index--) {
        //   regexString = `.*\\B` + `${word.substring(0, index)}` + `\\B.*`;
        //   regex = new RegExp(regexString, "dg");
        //   initialMatches = dictionary.match(regex);
        //   console.log(initialMatches);
        //   if (1 < initialMatches.length)
        //     return res.status(200).json({ suggestions: initialMatches, correct: true });
        // }
      }
      
      return res.status(400).json({ msg: 'Bad Request: Word not found' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      try {
        const user = await User
          .findOne({
            where: {
              email,
            },
          });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id });

          return res.status(200).json({ token, user });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };


  return {
    spellcheck
  };
};

module.exports = SpellcheckController;
