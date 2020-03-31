const lunr = require('lunr');

function buildIndex(data) {
  const idx = lunr( function() {
    this.field('label');

    data.forEach(item => {
      this.add(item);
    });
  });

  return idx;
}

module.exports = buildIndex;
