import { Prisma, CheckIn } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const ckeckIn = await prisma.checkIn.create({
      data,
    });

    return ckeckIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startDate = dayjs(date).startOf('date');
    const endDate = dayjs(date).endOf('date');

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startDate.toDate(),
          lte: endDate.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return checkIns;
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });
    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data: data,
    });

    return checkIn;
  }
}
