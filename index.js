const fetchData = require('./lib/fetch-data');
const lunr = require('./lib/lunr-helpers');
const Server = require('./lib/server');

module.exports = {
  Server,
  fetchData,
  lunr
};
