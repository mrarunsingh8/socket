let sqlite3 = require('sqlite3').verbose();
let dbConfig = new sqlite3.Database('data/db-data');

module.exports = dbConfig;