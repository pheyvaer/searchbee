const lunr = require('lunr');

function build(data) {
  const idx = lunr( function() {
    this.field('label');

    data.forEach(item => {
      this.add(item);
    });
  });

  return idx;
}

function load(str) {
  return lunr.Index.load(JSON.parse(str));
}

function serialize(index) {
  return JSON.stringify(index);
}

module.exports = {
  build,
  load,
  serialize
};
