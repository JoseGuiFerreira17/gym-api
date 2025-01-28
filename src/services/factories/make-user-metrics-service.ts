import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { UserMetricsService } from '../user-metrics';

export function makeUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const service = new UserMetricsService(checkInsRepository);

  return service;
}
