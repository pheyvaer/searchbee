const assert = require('assert');
const { Server, fetchData, searchIndex } = require('../index');
const { build } = searchIndex;
const fs = require('fs');
const http = require('http');

let server;

describe('Server', () => {
  describe('Search in remote RDF file', () => {

    before(() => {
      server = http.createServer(function (req, res) {
        fs.readFile(__dirname + req.url, function (err,data) {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          res.writeHead(200);
          res.end(data);
        });
      });

      server.listen(8081);
    });

    describe('should only return ash', () => {
      it('without labels', async () => {
        const data = await fetchData(['http://localhost:8081/resources/data.ttl']);
        const index = build(data);
        const server = new Server(index);
        await server.start();

        let result = await get('http://localhost:8080/?q=ash');
        assert.deepEqual(result, ['http://example.org/ash']);

        await server.close();
      });

      it('with labels', async () => {
        const data = await fetchData(['http://localhost:8081/resources/data.ttl']);
        const index = build(data);
        const server = new Server(index);
        await server.start();

        let result = await get('http://localhost:8080/?q=ash&i=true');
        assert.deepEqual(result, [{
          id: 'http://example.org/ash',
          label: 'Ash'
        }]);

        await server.close();
      });
    });

    it('should return nothing', async () => {
      const data = await fetchData(['http://localhost:8081/resources/data.ttl']);
      const index = build(data);
      const server = new Server(index);
      await server.start();

      let result = await get('http://localhost:8080/?q=brock');
      assert.deepEqual(result, []);

      await server.close();
    });

    describe('Use different label', () => {
      it('should return nothing', async () => {
        const data = await fetchData(['http://localhost:8081/resources/data.ttl'], 'http://schema.org/name');
        const index = build(data);
        const server = new Server(index);
        await server.start();

        let result = await get('http://localhost:8080/?q=ash');
        assert.deepEqual(result, []);

        result = await get('http://localhost:8080/?q=brock');
        assert.deepEqual(result, []);

        await server.close();
      });

      describe('should only return ash', () => {
        it('without labels', async () => {
          const data = await fetchData(['http://localhost:8081/resources/data-schema.ttl'], 'http://schema.org/name');
          const index = build(data);
          const server = new Server(index);
          await server.start();

          let result = await get('http://localhost:8080/?q=ash');
          assert.deepEqual(result, ['http://example.org/ash']);

          result = await get('http://localhost:8080/?q=brock');
          assert.deepEqual(result, []);

          await server.close();
        });

        it('with labels', async () => {
          const data = await fetchData(['http://localhost:8081/resources/data-schema.ttl'], 'http://schema.org/name');
          const index = build(data);
          const server = new Server(index);
          await server.start();

          let result = await get('http://localhost:8080/?q=ash&i=true');
          assert.deepEqual(result, [{
            id: 'http://example.org/ash',
            label: 'Ash'
          }]);

          result = await get('http://localhost:8080/?q=brock&i=true');
          assert.deepEqual(result, []);

          await server.close();
        });
      });
    });

    it('should return only given webids', async () => {
      const data = await fetchData(['http://localhost:8081/resources/data.ttl'], undefined, ['http://example.org/ash']);
      const index = build(data);
      const server = new Server(index);
      await server.start();

      let result = await get('http://localhost:8080/?q=ash');
      assert.deepEqual(result, ['http://example.org/ash']);

      result = await get('http://localhost:8080/?q=misty');
      assert.deepEqual(result, []);

      await server.close();
    });

    after(() => {
      server.close();
    });
  });
});

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(JSON.parse(data));
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
}
