import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateService } from '@/services/authenticate';
import { InvalidCredentialsError } from '@/services/erros/invalid-credentials';

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
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerService = new AuthenticateService(prismaUsersRepository);
    await registerService.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(200).send();
}
