import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCheckInService } from '@/services/factories/make-check-in-service';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = z
    .object({
      latitude: z.number().refine((v) => {
        return v >= -90 && v <= 90;
      }),
      longitude: z.number().refine((v) => {
        return v >= -180 && v <= 180;
      }),
    })
    .parse(request.body);

  const { gymId } = z
    .object({
      gymId: z.string().uuid(),
    })
    .parse(request.params);

  const userId = request.user.sub;

  const checkInService = makeCheckInService();
  await checkInService.execute({
    userId,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
