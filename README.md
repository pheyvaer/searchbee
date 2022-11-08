# :honeybee: Searchbee

This library and command line interface (CLI) start a server that 
offers a search API on top of knowledge graphs.

A lot of knowledge graph are hosted on the Web
where IRIs are used to uniquely identify resources.
In certain use cases when looking for the IRI of a specific resource 
users want to search for it
based on its label or description.
This library and CLI offer such a search functionality on top of these knowledge graphs.
It starts a server that accepts a single GET request with the searched term.

## Usage

1. Install Searchbee via `npm -g i searchbee`.
2. Either start a server or generate an index.

### Start server

1. Execute Searchbee via `searchbee server -s [sources]` 
where `sources` is a comma-separated list of sources, 
such as TPF servers, RDF files, and SPARQL endpoints.
2. Search for the resources via `curl http://localhost:8080/?q=[term]`
where `term` is the search term.
The output is a JSON array with the IRIs of the matched resources.

The search index is by default build based on the triples with predicate
`http://www.w3.org/2000/01/rdf-schema#label`.
This is overwritten through the option `-l, --label`.
The search index considers by default all resources that are found.
This is overwritten through the option `--resources`.
In this case the index only considers the resources that match the sources.
For example, if your sources are `http://example.org/A` and `http://example.org/B`,
then the index is built only with triples about these two resources.
Even if the sources return for example triples about `http://example.org/C`.

#### Example

1. `searchbee server -s https://ruben.verborgh.org/profile/#me`
   starts a server based on the data at `https://ruben.verborgh.org/profile/#me`.
2. `curl http://localhost:8080/?q=ruben`
   searches for resources mentioning "ruben".
   
### Generate index

By generating an index before staring the server 
allows you to reuse the index when restarting the server.
This removes the need to create the index every time you start the server,
which might be time-consuming for big sources.

1. Execute Searchbee via `searchbee index -s [sources] -f [path]` 
where `sources` is a comma-separated list of sources, 
such as TPF servers, RDF files, and SPARQL endpoints, and
`path` points to the file that stores the index.

2. Execute Searchbee via `searchbee server -f [path]` 
   where `path` points to the file that stores the index.
   
#### Example

1. `searchbee index -s https://ruben.verborgh.org/profile/#me -f index.json`
  generates an index based on the data at `https://ruben.verborgh.org/profile/#me`
  and stores in the file `index.json`.
2. `searchbee server -f index.json`
  starts a server based on the index in `index.json`.
   
## Development

1. Install dependencies via `npm i`.
2. Make changes.
3. Execute Searchbee via `node ./bin/cli.js`.

## Documentation

We use [Vale](https://errata-ai.gitbook.io/vale/) to lint the documentation.

1. Install [Vale](https://errata-ai.gitbook.io/vale/getting-started/installation).
2. Execute `npm run lint:docs` to lint the documentation.

## License

© 2020 [Pieter Heyvaert](https://pieterheyvaert.com), 
[MIT License](https://github.com/pheyvaer/searchbee/blob/master/LICENSE.md)
