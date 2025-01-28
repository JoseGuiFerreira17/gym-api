import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history-service';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const { page } = z
    .object({
      page: z.coerce.number().min(1).default(1),
    })
    .parse(request.query);

  const userId = request.user.sub;

  const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService();
  const { checkIns } = await fetchUserCheckInsHistoryService.execute({
    userId,
    page,
  });

  return reply.status(200).send({ checkIns });
}
