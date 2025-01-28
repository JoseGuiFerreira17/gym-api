import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticate } from '@/utils/test/create-and-authenticate';
import { prisma } from '@/lib/prisma';

describe('check-in history controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list check-in history', async () => {
    const { token } = await createAndAuthenticate(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Academia do Zé',
        description: 'Academia do Zé, a melhor academia do Brasil',
        phone: '123456789',
        latitude: -10.434596,
        longitude: -45.1676218,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: gym.id }),
        expect.objectContaining({ user_id: user.id }),
      ]),
    );
  });
});
