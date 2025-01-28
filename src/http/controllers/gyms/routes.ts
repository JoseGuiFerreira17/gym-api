import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { nearby } from './nearby';
import { search } from './search';
import { create } from './create';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/nearby', nearby);
  app.get('/search', search);
  app.post('/', create);
}
