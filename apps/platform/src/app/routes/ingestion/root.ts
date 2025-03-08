import { FastifyInstance, FastifyRequest } from 'fastify';
import { graph } from '@documate/agent/lib/ingestion_graph/graph';
import { Document } from '@langchain/core/documents';

interface BodyType {
  docs: Document[] | { [key: string]: any }[] | string[] | string | 'delete';
}

export default async function (fastify: FastifyInstance) {
  fastify.put('/', async function (req: FastifyRequest<{ Body: BodyType }>) {
    const { docs } = req.body;
    const res = await graph.invoke({
      docs: docs,
    })
    return { message: res };
  });
}
