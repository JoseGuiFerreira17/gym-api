import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { query, page } = z
    .object({
      query: z.string().min(3),
      page: z.coerce.number().min(1).default(1),
    })
    .parse(request.query);

  const searchGymService = makeSearchGymsService();
  const { gyms } = await searchGymService.execute({ query, page });

  return reply.status(201).send({ gyms });
}
