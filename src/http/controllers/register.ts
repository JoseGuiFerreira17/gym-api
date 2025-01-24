import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserAlreadyExistsError } from '@/services/erros/users-already-exists';
import { makeRegisterService } from '@/services/factories/make-register-service';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(request.body);

  try {
    const registerService = makeRegisterService();
    await registerService.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(201).send();
}
