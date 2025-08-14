// CJS wrapper to ensure knex CLI loads ts-node registration before reading TS migrations
require('dotenv').config();
try {
  require('ts-node').register({ transpileOnly: true });
} catch {}
module.exports = require('./knexfile.js');
