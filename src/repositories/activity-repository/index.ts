import { prisma } from '@/config';

async function findActivitiesByDate(minDate: Date, maxDate: Date) {
  return prisma.activity.findMany({
    where: {
      startsAt: {
        lt: maxDate,
        gt: minDate,
      },
    },
    orderBy: {
      startsAt: 'asc',
    },
  });
}

async function findActivityLocations() {
  return prisma.activityLocation.findMany();
}

const activityRepository = {
  findActivitiesByDate,
  findActivityLocations,
};

export default activityRepository;
