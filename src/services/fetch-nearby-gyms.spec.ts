import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsService } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe('fetch nearby gyms service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'JavaScript Gym description',
      phone: '123456789',
      latitude: -10.4376227,
      longitude: -45.1676542,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Gym typescript description',
      phone: '123456789',
      latitude: -10.6500939,
      longitude: -45.1841792,
    });

    const { gyms } = await sut.execute({
      userLatitude: -10.4375489,
      userLongitude: -45.1633842,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
