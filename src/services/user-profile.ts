import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { ResourceNotFound } from './erros/resource-not-found';

interface UserProfileServiceRequest {
  userId: string;
}

interface UserProfileServiceResponse {
  user: User;
}

export class UserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: UserProfileServiceRequest): Promise<UserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFound();
    }

    return { user };
  }
}
