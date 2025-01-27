import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInService } from './validate-check-in';
import { ResourceNotFound } from './errors/resource-not-found';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('check-in service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    // vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'checkin-01' }),
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
