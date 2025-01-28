import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateGymService } from '@/services/factories/make-create-gym-service';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { title, description, phone, latitude, longitude } = z
    .object({
      title: z.string().min(3),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      latitude: z.number().refine((v) => {
        return v >= -90 && v <= 90;
      }),
      longitude: z.number().refine((v) => {
        return v >= -180 && v <= 180;
      }),
    })
    .parse(request.body);

  const createGymService = makeCreateGymService();
  await createGymService.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
