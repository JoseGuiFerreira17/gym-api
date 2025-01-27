import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface UserMetricsServiceRequest {
  userId: string;
}

interface UserMetricsServiceResponse {
  checkInsCount: number;
}

export class UserMetricsService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: UserMetricsServiceRequest): Promise<UserMetricsServiceResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return { checkInsCount };
  }
}
