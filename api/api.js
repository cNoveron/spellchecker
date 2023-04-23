/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');

/**
 * server configuration
 */
const config = require('../config/');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
// const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// secure your private routes with jwt authentication middleware
app.all('/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('', mappedOpenRoutes);
app.use('/private', mappedAuthRoutes);

const intercalateVowelsDeep = require('./functions/intercalateVowelsDeep');

const possibleFixables = require('./functions/possibleFixables');
const possibleFixablesDeep = require('./functions/possibleFixablesDeep');

const possibleFixesDeep = require('./functions/possibleFixesDeep');
const possibleFixes = require('./functions/possibleFixes');
app.get('/test', (req, res) => {
  // console.log(possibleFixesDeep("gud",4)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("gud",1),1)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("gud",2),1)); // true (can form "guide")

  // console.log(possibleFixesDeep("wrd",4)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("wrd",1),1)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("wrd",2),1)); // true (can form "guide")

  // console.log(possibleFixesDeep("tll",4)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("tll",1),1)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("tll",2),1)); // true (can form "guide")

  // console.log(intercalateVowelsDeep("blln",3)); 
  // console.log(possibleFixablesDeep("blln",3)); 
  console.log(possibleFixablesDeep("blln",2).flatMap(f => possibleFixes(f))); 
  // console.log(possibleFixables("blln").map(p => possibleFixables(p))); 


  // console.log(possibleFixesDeep(possibleFixablesDeep("gud",2),4)); // true (can form "guide")
  // console.log(possibleFixesDeep(possibleFixablesDeep("ppr",2),4)); // true (can form "paper")
  // console.log(possibleFixesDeep(possibleFixablesDeep("wrd",2),4)); // true (can form "word")
  // console.log(possibleFixesDeep(possibleFixablesDeep("frml",2),4)); // true (can form "formal")
  // console.log(possibleFixesDeep(possibleFixablesDeep("tll",2),4)); // true (can form "tally")
  // console.log(possibleFixesDeep(possibleFixablesDeep("bgn",2),4)); // true (can form "begin")
  // console.log(possibleFixesDeep(possibleFixablesDeep("cmp",2),4)); // true (can form "camp")
  // console.log(possibleFixesDeep(possibleFixablesDeep("plc",2),4)); // true (can form "place")
  // console.log(possibleFixesDeep(possibleFixablesDeep("dgr",2),4)); // true (can form "dogger")
  // console.log(possibleFixesDeep(possibleFixablesDeep("kts",2),4)); // false (no English word can be formed)
  // console.log(possibleFixesDeep(possibleFixablesDeep("vn",2),4)); // true (can form "oven")
  // console.log(possibleFixesDeep(possibleFixablesDeep("btl",2),4)); // true (can form "bottle")
  res.status(200).json({})
})

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  // return DB;
});
