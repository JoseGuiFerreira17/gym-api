import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '@/services/erros/invalid-credentials';
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(request.body);

  try {
    const registerService = makeAuthenticateService();
    await registerService.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(200).send();
}
