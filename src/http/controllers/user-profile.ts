import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ResourceNotFound } from '@/services/errors/resource-not-found';
import { makeUserProfileService } from '@/services/factories/make-user-profile';

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z
    .object({
      id: z.string().uuid(),
    })
    .parse(request.params);

  try {
    const registerService = makeUserProfileService();
    await registerService.execute({ userId: id });
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(200).send();
}
