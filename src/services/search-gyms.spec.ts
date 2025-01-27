import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsService } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('search gyms service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it('should be able to fetch user check-in history', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'JavaScript Gym description',
      phone: '123456789',
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: 'Gym typescript description',
      phone: '123456789',
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      query: 'javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ]);
  });

  it('should be able to get paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: 'JavaScript Gym description',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({
      query: 'javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);
  });
});
