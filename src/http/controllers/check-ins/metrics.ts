import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUserMetricsService } from '@/services/factories/make-user-metrics-service';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const userMetricsServices = makeUserMetricsService();
  const { checkInsCount } = await userMetricsServices.execute({
    userId,
  });

  return reply.status(201).send({ checkInsCount });
}
