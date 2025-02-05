import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials';
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
    const { user } = await registerService.execute({ email, password });

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } },
    );
    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } },
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
