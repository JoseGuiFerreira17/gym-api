import { FastifyInstance } from 'fastify';
import { register } from '@/http/controllers/register';
import { authenticate } from './controllers/authenticate';
import { getUserProfile } from './controllers/user-profile';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);
  app.get('/users/:id', getUserProfile);
}
