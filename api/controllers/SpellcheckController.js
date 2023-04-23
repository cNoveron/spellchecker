const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

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
      console.log(regex);
      
      initialMatches = dictionary.match(regex);
      console.log(initialMatches);
      if (initialMatches !== null && initialMatches !== []) {
        if (initialMatches.length === 1)
          return res.status(200).json({ suggestions: [], correct: true });
      }
      else {
        let r
        let vowelRepetition_regexStrings = [
          /a{2,}/dgi,
          /e{3,}/dgi,
          /i{2,}/dgi,
          /o{3,}/dgi,
          /u{2,}/dgi,
        ]
        console.log(vowelRepetition_regexStrings);
        let vowelRepetition_matches = vowelRepetition_regexStrings.map(s => word.match(s))
        // let vowelRepetition_matches = vowelRepetition_regexStrings.map(s => word.match(s))
        // let filtered_vRepMatches = vowelRepetition_matches.filter(e => e !== null)
        // console.log(filtered_vRepMatches);
        let vowelFixers = [
          (acc, curr) => acc.replace(curr,'a'),
          (acc, curr) => acc.replace(curr,'ee'),
          (acc, curr) => acc.replace(curr,'i'),
          (acc, curr) => acc.replace(curr,'oo'),
          (acc, curr) => acc.replace(curr,'u'),
        ]

        r = _.zip(vowelRepetition_matches, vowelFixers)
        r = r.filter(e => e[0] !== null)
        console.log(r);
        r = r.reduce((acc, curr) => curr[0] === null ? null : curr[0].reduce(curr[1], acc), word)
        console.log(r);
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
