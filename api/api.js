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

const checkSequence = require('./functions/possibleFixesDeep');
app.get('/test', (req, res) => {

  console.log(checkSequence("gud",2)); // true (can form "guide")
  console.log(checkSequence("ppr",2)); // true (can form "paper")
  console.log(checkSequence("wrd",2)); // true (can form "word")
  console.log(checkSequence("frml",2)); // true (can form "formal")
  console.log(checkSequence("tll",2)); // true (can form "tally")
  console.log(checkSequence("bgn",2)); // true (can form "begin")
  console.log(checkSequence("cmp",2)); // true (can form "camp")
  console.log(checkSequence("plc",2)); // true (can form "place")
  console.log(checkSequence("dgr",2)); // true (can form "dogger")
  console.log(checkSequence("kts",2)); // false (no English word can be formed)
  console.log(checkSequence("vn",2)); // true (can form "oven")
  console.log(checkSequence("btl",2)); // true (can form "bottle")
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
