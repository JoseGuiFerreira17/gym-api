import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { UserMetricsService } from './user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: UserMetricsService;

describe('user metrics service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new UserMetricsService(checkInsRepository);
  });

  it('should be able to get user metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    });

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
