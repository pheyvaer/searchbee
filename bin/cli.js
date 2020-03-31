#!/usr/bin/env node

const { program } = require('commander');
const { Server, fetchData, lunr } = require('../index');
const { build, load, serialize } = lunr;
const fs = require('fs-extra');

program
  .command('server')
  .option('-p, --port <int>', 'Port of the server', '8080')
  .option('-s, --sources <string>', 'Comma-separated list of sources to use for the index.', commaSeparatedList)
  .option('-r, --root <string>', 'Root path of the server', '/')
  .option('-f, --file <string>', 'Path to serialized index.')
  .description('Start a server.')
  .action(doServer);

program
  .command('index')
  .option('-s, --sources <string>', 'Comma-separated list of sources to use for the index.', commaSeparatedList)
  .option('-f, --file <string>', 'Path to write serialized index.')
  .description('Generate index and write to file.')
  .action(doIndex);

program.parse(process.argv);

/**
 * This method hanldes the "server" command of the CLI.
 * @param cmdObj The object with the options that have been passed.
 * @returns {Promise<void>}
 */
async function doServer(cmdObj) {
  if ((!cmdObj.sources || cmdObj.sources.length === 0) && !cmdObj.file) {
    console.error('Please provide at least one source via -s, --sources or one file via -f, --file.');
    process.exit(1);
  }

  if (cmdObj.file && cmdObj.sources) {
    console.error('Please only use one of the options -f, --file and -s, --sources.');
    process.exit(1);
  }

  let index;

  if (cmdObj.file) {
    const deserializedData = await fs.readFile(cmdObj.file, 'utf-8');
    console.log('Index loaded from file.');
    index = load(deserializedData);
  } else {
    const data = await fetchData(cmdObj.sources);
    console.log('Data fetched.');
    index = build(data);
    console.log("Index built.");
  }

  const server = new Server(index, {logger: true});
  server.start();
}

/**
 * This method handles the "index" command of the CLI.
 * @param cmdObj The object with the options that have been passed.
 * @returns {Promise<void>}
 */
async function doIndex(cmdObj) {
  if (!cmdObj.sources || cmdObj.sources.length === 0) {
    console.error('Please provide at least one source via -s, --sources.');
    process.exit(1);
  }

  if (!cmdObj.file && cmdObj.sources) {
    console.error('Please provide a file via -f, --file.');
    process.exit(1);
  }

  const data = await fetchData(cmdObj.sources);
  console.log('Data fetched.');
  const index = build(data);
  console.log("Index built.");
  const serializedIndex = serialize(index);
  fs.writeFile(cmdObj.file, serializedIndex, 'utf-8');
}

/**
 * This method creates an array from a comma-separated list.
 * @param value The comma-separated list.
 * @param dummyPrevious
 * @returns {*|string[]}
 */
function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}
