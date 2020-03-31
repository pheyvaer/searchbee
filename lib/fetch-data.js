const {Client} = require('graphql-ld');
const {QueryEngineComunica} = require('graphql-ld-comunica');

async function fetchData(sources) {
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
    data = data.concat(await _fetchDataFromRegular(regularSources));
  }

  for (const source of hdtSources) {
    data = data.concat(await _fetchDataFromHDT(source));
  }

  return data;
}

async function _fetchDataFromRegular(sources) {
  const context = {
    "@context": {
      "label": { "@id": "http://www.w3.org/2000/01/rdf-schema#label" }
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

async function _fetchDataFromHDT(filePath) {
  return new Promise(async (resolve, reject) => {
    const newEngine = require('@comunica/actor-init-sparql-hdt').newEngine;
    const myEngine = newEngine();

    const results = [];

    const result = await myEngine.query('SELECT * WHERE { ?s <http://www.w3.org/2000/01/rdf-schema#label> ?o.}',
      {sources: [{type: 'hdtFile', value: filePath}]});
    result.bindingsStream.on('data', (data) => {
      data = data.toObject();

      if (data['?o'].value !== '') {
        results.push({
          id: data['?s'].value,
          label: data['?o'].value
        });
      }
    });

    result.bindingsStream.on('end', () => {
      resolve(results);
    });
  });
}

module.exports = fetchData;
