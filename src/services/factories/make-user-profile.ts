import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserProfileService } from '../user-profile';

export function makeUserProfileService() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerService = new UserProfileService(prismaUsersRepository);

  return registerService;
}
