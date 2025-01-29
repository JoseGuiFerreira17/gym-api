import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticate } from '@/utils/test/create-and-authenticate';

describe('nearby gyms controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticate(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia longe',
        description: 'Academia, a melhor academia do Brasil',
        phone: '123456789',
        latitude: -10.6532658,
        longitude: -45.1868394,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia perto',
        description: 'Academia, a segunda melhor academia do Brasil',
        phone: '123456788',
        latitude: -10.4377151,
        longitude: -45.1611225,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -10.4374483,
        longitude: -45.1618019,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Academia perto' }),
    ]);
  });
});
