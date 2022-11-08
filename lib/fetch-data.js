const {Client} = require('graphql-ld');
const {QueryEngineComunica} = require('graphql-ld-comunica');

/**
 * This method fetches the data needed to build an index from the provided sources.
 * @param sources - An array of sources, such as TPF servers, RDF files, and SPARQL endpoints.
 * @param predicate - The predicate that needs to be fetched to build an index from.
 * @param webids - An array of WebIDs (or other resources) for which the index should build.
 * @returns {Promise<[]>}
 */
async function fetchData(sources, predicate = 'http://www.w3.org/2000/01/rdf-schema#label', webids = null ) {
  const regularSources = [];
  const hdtSources = [];
  let data = [];

  sources.forEach(source => {
    if (source.endsWith('.hdt')) {
      hdtSources.push(source);
    } else {
      regularSources.push(source);
    }
  });

  if (regularSources.length > 0) {
    data = data.concat(await _fetchDataFromRegular(regularSources, predicate));
  }

  for (const source of hdtSources) {
    data = data.concat(await _fetchDataFromHDT(source, predicate));
  }

  if (webids) {
    data = data.filter(el => {
      return webids.includes(el.id);
    });
  }

  return data;
}

/**
 * This method queries regular sources, i.e., non-HDT files.
 * @param sources An array of sources such as TPF servers, RDF files, and SPARQL endpoints.
 * @param predicate The predicate used in the query.
 * @returns {Promise<ExecutionResultDataDefault>}
 * @private
 */
async function _fetchDataFromRegular(sources, predicate) {
  const context = {
    "@context": {
      "label": predicate
    }
  };

  const comunicaConfig = {sources};
  const client = new Client({ context, queryEngine: new QueryEngineComunica(comunicaConfig) });

  const query = `
  query {
    id @single
    label @single
  }`;

  const { data } = await client.query({ query });

  return data;
}

/**
 * This method queries an HDT file.
 * @param filePath The path to the HDT file.
 * @param predicate The predicate used in the query.
 * @returns {Promise<unknown>}
 * @private
 */
async function _fetchDataFromHDT(filePath, predicate) {
  return new Promise(async (resolve, reject) => {
    const newEngine = require('@comunica/actor-init-sparql-hdt').newEngine;
    const myEngine = newEngine();

    const results = [];

    const result = await myEngine.query(`SELECT * WHERE { ?s <${predicate}> ?o.}`,
      {sources: [{type: 'hdtFile', value: filePath}]});
    result.bindingsStream.on('data', (data) => {
      data = data.toObject();
      const o = data['?o'];

      if (o.value !== '' && (o.language === '' || o.language === 'en')) {
        results.push({
          id: data['?s'].value,
          label: o.value
        });
      }
    });

    result.bindingsStream.on('end', () => {
      resolve(results);
    });
  });
}

module.exports = fetchData;
