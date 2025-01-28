import { makeUserProfileService } from '@/services/factories/make-user-profile-service';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeUserProfileService();

  const { user } = await getUserProfile.execute({ userId: request.user.sub });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
