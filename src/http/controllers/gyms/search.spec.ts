import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticate } from '@/utils/test/create-and-authenticate';

describe('search gyms controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticate(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia do Zé',
        description: 'Academia do Zé, a melhor academia do Brasil',
        phone: '123456789',
        latitude: -10.434596,
        longitude: -45.1676218,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia do João',
        description: 'Academia do João, a segunda melhor academia do Brasil',
        phone: '123456788',
        latitude: -10.434596,
        longitude: -45.1676218,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'João',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Academia do João' }),
    ]);
  });
});
