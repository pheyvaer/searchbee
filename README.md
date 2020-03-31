# :honeybee: Searchbee

This library and command line interface (CLI) starts a server that 
offers a search API op top of knowledge graphs.

A lot of knowledge graph are hosted on the Web
where IRIs are used to uniquely identified resources.
In certain use cases when looking for the IRI of a specific resource 
users want to search for it
based on its label or description.
This library and CLI offers such a search functionality on top of these knowledge graphs.
It starts a server that accepts a single GET request with the searched term.

## Usage

1. Install Searchbee via `npm -g i searchbee`.
2. Execute Searchbee via `searchbee server -s [sources]` 
where `sources` is a comma-separated list of sources, 
such as TPF servers, RDF files, and SPARQL endpoints.
For example 
`searchbee server -s https://ruben.verborgh.org/profile/#me`
starts a server based on the data at `https://ruben.verborgh.org/profile/#me`.
3. Search for the resources via `curl http://localhost:8080/?q=[term]`
where `term` is the search term.
For example
`curl http://localhost:8080/?q=ruben`
searches for resources mentioning "ruben".
The output is a JSON array with the IRIs of the resources and 
the scores of how closely the resources match the search term.

Currently, the search index is build based on the triples with predicate
`http://www.w3.org/2000/01/rdf-schema#label`.

## Development

1. Install dependencies via `npm i`.
2. Make changes.
3. Execute Searchbee via `node ./bin/cli.js -h`

## License

© 2020 [Pieter Heyvaert](https://pieterheyvaert.com), 
[MIT License](https://github.com/pheyvaer/searchbee/blob/master/LICENSE.md)
