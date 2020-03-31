const {Client} = require('graphql-ld');
const {QueryEngineComunica} = require('graphql-ld-comunica');

async function fetchData(sources) {
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

module.exports = fetchData;
