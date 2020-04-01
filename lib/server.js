const Fastify = require('fastify');

const defaultOptions = {
  port: 8080,
  path: '/'
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

      reply.header('Content-Type', 'application/json; charset=utf-8');

      if (!searchTerm) {
        reply
          .status(400);
        return {
          error: 'No query was provided.'
        }
      } else {
        const result = index.search(searchTerm);

        return result.map(item => {
          return {iri: item.ref, score: item.score};
        });
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
}

module.exports = Server;
