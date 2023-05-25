import { prisma } from '@/config';

async function findActivitiesByDate(minDate: Date, maxDate: Date, userId: number) {
  return prisma.activity.findMany({
    where: {
      startsAt: {
        lt: maxDate,
        gt: minDate,
      },
    },
    include: {
      UserActivities: {
        where: {
          userId,
        },
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

async function findActivityById(id: number) {
  return prisma.activity.findFirst({
    where: {
      id,
    },
  });
}

async function reduceActivitySeats(id: number) {
  return prisma.activity.update({
    where: {
      id,
    },
    data: {
      openSeats: {
        decrement: 1,
      },
    },
  });
}

async function incrementActivitySeats(id: number) {
  return prisma.activity.update({
    where: {
      id,
    },
    data: {
      openSeats: {
        increment: 1,
      },
    },
  });
}

async function findUserActivity(userId: number, activityId: number) {
  return prisma.userActivities.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

async function createUserActivity(userId: number, activityId: number) {
  return prisma.userActivities.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function deleteUserActivity(id: number) {
  return prisma.userActivities.delete({
    where: { id },
  });
}

const activityRepository = {
  findActivitiesByDate,
  findActivityLocations,
  findActivityById,
  reduceActivitySeats,
  createUserActivity,
  deleteUserActivity,
  incrementActivitySeats,
  findUserActivity,
};

export default activityRepository;
