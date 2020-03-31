const fetchData = require('./lib/fetch-data');
const buildIndex = require('./lib/build-index');
const Server = require('./lib/server');

main();

async function main() {
  const sources = [
    'https://ruben.verborgh.org/profile/#me'
  ];

  const data = await fetchData(sources);
  console.log('Data fetched.');
  const index = buildIndex(data);
  console.log("Index built.");

  // console.log(index.search('kevin'));

  const server = new Server(index, {logger: true});
  server.start();
}
