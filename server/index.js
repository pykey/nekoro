/** @module index */

/**
 * Run Newrelic if we are in production and deployed in Heroku
 */
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEW_RELIC_APP_NAME &&
  process.env.NEW_RELIC_LICENSE_KEY
) {
  require('newrelic');
}

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const ParseServer = require('parse-server').ParseServer;

const setup = require('./middlewares/frontendMiddleware');
const app = express();

/**
 * Apply standard middlewares
 */
app.use(helmet());
app.use(compression());

/**
 * Get host from environment or use default
 *
 * @const {(string|null)}
 * @default null
 */
const host = process.env.HOST || null;

/**
 * If host is null, translate it to localhost
 *
 * @type {string}
 * @default localhost
 */
const prettyHost = host || 'localhost';

/**
 * Get port from environment or use default
 *
 * @type {number}
 * @default 3000
 */
const port = process.env.PORT || 3000;

/**
 * Define Parse server middleware
 *
 * @type {ParseServer}
 */
const api = new ParseServer({
  databaseURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/nekoro',
  cloud: process.env.CLOUD || `${__dirname}/cloud/main.js`,
  appId: process.env.APP_ID || 'nekoro',
  masterKey: process.env.MASTER_KEY || 'nekoro',
  serverURL: process.env.SERVER_URL || `http://${prettyHost}:${port}/api`,
  liveQuery: {
    classNames: []
  }
});

/**
 * Apply custom middlewares
 */
app.use('/api', api);

/**
 * Apply setup middleware, load the static app files
 */
setup(app);

/**
 * Start app at specified port and host. Throw error on fail
 */
app.listen(port, host, err => {
  if (err) {
    throw new Error(err.message);
  }

  console.log(`App started at ${prettyHost}:${port}`);
});

/**
 * Express app instance
 */
module.exports = app;
