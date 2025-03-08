import { graph } from '@documate/agent/lib/retrieval_graph/graph';
import { FastifyInstance, FastifyRequest } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (req: FastifyRequest<{ Querystring: { query: string } }>, reply) {
    const { query } = req.query;

    // Set headers for streaming response
    reply.raw.setHeader('Content-Type', 'application/json');
    reply.raw.setHeader('Transfer-Encoding', 'chunked');

    const responseStream: any = await graph.stream({ query }, {
      streamMode: ['messages','updates'],
    });
    for await (const response of responseStream) {
      reply.raw.write(JSON.stringify(response) + '\n');
    }

    reply.raw.end();
  });
}
