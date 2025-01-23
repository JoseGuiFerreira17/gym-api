import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterService } from '@/services/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/erros/users-already-exists';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(prismaUsersRepository);
    await registerService.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send();
  }

  return reply.status(201).send();
}
