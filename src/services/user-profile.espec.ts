import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserProfileService } from './user-profile';
import { hash } from 'bcryptjs';
import { ResourceNotFound } from './erros/resource-not-found';

let usersRepository: InMemoryUsersRepository;
let sut: UserProfileService;

describe('get user profile service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UserProfileService(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John Doe');
  });

  it('should not be able to get user profile', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
