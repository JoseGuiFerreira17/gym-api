import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInService } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins';
import { MaxDistanceError } from './errors/max-distance';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('check-in service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym 01',
      description: 'Gym 01 description',
      phone: '123456789',
      latitude: -10.434596,
      longitude: -45.1676218,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.434596,
      userLongitude: -45.1676218,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.434596,
      userLongitude: -45.1676218,
    });

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -10.434596,
        userLongitude: -45.1676218,
      }),
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError);
  });

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.434596,
      userLongitude: -45.1676218,
    });

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.434596,
      userLongitude: -45.1676218,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));
    gymsRepository.items.push({
      id: 'gym-02',
      description: 'Gym 02 description',
      phone: '123456789',
      title: 'Gym 02',
      latitude: new Decimal(-10.439112),
      longitude: new Decimal(-45.1701109),
    });

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -10.434596,
        userLongitude: -45.1676218,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
