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

const possibleFixables = require('./functions/possibleFixables');
const possibleFixablesDeep = require('./functions/possibleFixablesDeep');

const possibleFixesDeep = require('./functions/possibleFixesDeep');
const possibleFixes = require('./functions/possibleFixes');
app.get('/test', (req, res) => {

  // console.log(possibleFixesDeep("blln",2)); // true (can form "kites")
  // console.log(possibleFixablesDeep("blln",1).flatMap(f => possibleFixes(f))); 
  // console.log(possibleFixablesDeep("blln",2).flatMap(f => possibleFixes(f))); 

  // console.log(possibleFixesDeep("bnna",2)); // true (can form "kites")
  // console.log(possibleFixablesDeep("bnna",2)); 
  console.log(possibleFixablesDeep("bnna",2).flatMap(f => possibleFixes(f))); 
  // console.log(possibleFixablesDeep("bnna",2).flatMap(f => possibleFixes(f))); 
  // console.log(possibleFixables("blln").map(p => possibleFixables(p))); 


  console.log(possibleFixablesDeep("gud",2).flatMap(f => possibleFixes(f))); // true (can form "guide")
  console.log(possibleFixablesDeep("ppr",2).flatMap(f => possibleFixes(f))); // true (can form "paper")
  console.log(possibleFixablesDeep("wrd",2).flatMap(f => possibleFixes(f))); // true (can form "word")
  console.log(possibleFixablesDeep("frml",2).flatMap(f => possibleFixes(f))); // true (can form "formal")
  console.log(possibleFixablesDeep("tll",2).flatMap(f => possibleFixes(f))); // true (can form "tally")
  console.log(possibleFixablesDeep("bgn",2).flatMap(f => possibleFixes(f))); // true (can form "begin")
  console.log(possibleFixablesDeep("cmp",2).flatMap(f => possibleFixes(f))); // true (can form "camp")
  console.log(possibleFixablesDeep("plc",2).flatMap(f => possibleFixes(f))); // true (can form "place")
  console.log(possibleFixablesDeep("dgr",2).flatMap(f => possibleFixes(f))); // true (can form "dogger")
  console.log(possibleFixesDeep("kts",4)); // true (can form "kites")
  console.log(possibleFixablesDeep("kts",2).flatMap(f => possibleFixes(f))); // true (can form "kites")
  console.log(possibleFixablesDeep("vn",2).flatMap(f => possibleFixes(f))); // true (can form "oven")
  console.log(possibleFixablesDeep("btl",2).flatMap(f => possibleFixes(f))); // true (can form "bottle")
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
