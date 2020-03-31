const lunr = require('lunr');

/**
 * This method build a lunr index based on the provided data.
 * @param data An array of objects with a label and id.
 * @returns {*}
 */
function build(data) {
  const idx = lunr( function() {
    this.field('label');

    data.forEach(item => {
      this.add(item);
    });
  });

  return idx;
}

/**
 * This method creates a lunr index by loading the given string.
 * @param str The string that needs to be loaded into the index.
 * @returns {lunr.Index}
 */
function load(str) {
  return lunr.Index.load(JSON.parse(str));
}

/**
 * This method serializes a provided index.
 * The output is used by the method load.
 * @param index The index that needs to be serialized.
 * @returns {string}
 */
function serialize(index) {
  return JSON.stringify(index);
}

module.exports = {
  build,
  load,
  serialize
};
