const Fastify = require('fastify');

const defaultOptions = {
  port: 8080,
  path: '/',
  host: '0.0.0.0'
};

class Server {

  constructor(index, options) {
    this.options = {...defaultOptions, ...options};

    if (!this.options.logger) {
      this.fastify = Fastify();
    } else {
      this.fastify = Fastify({logger: this.options.logger});
    }

    this.fastify.get(this.options.path, async (request, reply) => {
      const searchTerm = request.query.q;
      let includeLabels = request.query.i;

      if (includeLabels) {
        includeLabels = includeLabels === 'true';
      }

      reply.header('Content-Type', 'application/json; charset=utf-8');

      if (!searchTerm) {
        reply
          .status(400);
        return {
          error: 'No query was provided.'
        }
      } else {
        const results = await index.search(searchTerm);

        if (includeLabels) {
          return results;
        } else {
          return results.map(result => result.id);
        }
      }
    });
  }

  async start() {
    try {
      await this.fastify.listen(this.options.port);
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }

  async close() {
    try {
      await this.fastify.close();
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

module.exports = Server;
