import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { makeFetchNearbyGymsService } from '@/services/factories/make-fetch-nearby-gyms-service';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = z
    .object({
      latitude: z.coerce.number().refine((v) => {
        return v >= -90 && v <= 90;
      }),
      longitude: z.coerce.number().refine((v) => {
        return v >= -180 && v <= 180;
      }),
    })
    .parse(request.query);

  const fetchNearbyGymsService = makeFetchNearbyGymsService();
  const { gyms } = await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
