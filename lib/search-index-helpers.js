const FlexSearch = require('flexsearch');

/**
 * This method build a FlexSearch index based on the provided data.
 * @param data An array of objects with a label and id.
 * @returns {*}
 */
function build(data) {
  const index = new FlexSearch({
    doc: {
      id: 'id',
      field: 'label'
    }});

  index.add(data);

  return index;
}

/**
 * This method creates a FlexSearch index by loading the given string.
 * @param str The string that needs to be loaded into the index.
 * @returns FlexSearch index.
 */
function load(str) {
  const index = new FlexSearch({
    doc: {
      id: 'id',
      field: 'label'
    }});

  const {idx, docs} = JSON.parse(str);

  index.import(idx, {index: true, doc: false});
  index.import(docs, {index: false, doc: true});

  return index;
}

/**
 * This method serializes a provided index.
 * The output is used by the method load.
 * @param index The index that needs to be serialized.
 * @returns {string}
 */
function serialize(index) {
  const idx = index.export({index: true, doc: false});
  const docs = index.export({index: false, doc: true});

  return JSON.stringify({idx, docs});
}

module.exports = {
  build,
  load,
  serialize
};
