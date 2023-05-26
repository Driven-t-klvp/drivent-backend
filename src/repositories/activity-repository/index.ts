import { prisma } from '@/config';

async function findActivitiesByDate(minDate: Date, maxDate: Date, enrollmentId: number) {
  return prisma.activity.findMany({
    where: {
      startsAt: {
        lt: maxDate,
        gt: minDate,
      },
    },
    include: { Tickets: { where: { enrollmentId } } },

    orderBy: {
      startsAt: 'asc',
    },
  });
}
async function searchConflicTicketActivities(minDate: Date, maxDate: Date, enrollmentId: number) {
  return prisma.activity.findMany({
    where: {
      OR: [
        {
          startsAt: {
            lte: maxDate,
            gte: minDate,
          },
        },
        {
          endsAt: {
            lte: maxDate,
            gte: minDate,
          },
        },
        {
          startsAt: {
            lt: maxDate,
          },
          endsAt: {
            gt: minDate,
          },
        },
      ],
    },
    select: { Tickets: { where: { enrollmentId } } },

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

async function findTicketActivity(id: number, activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
    select: { Tickets: { where: { id } } },
  });
}

async function createTicketActivity(id: number, activityId: number) {
  return prisma.ticket.update({
    where: { id },
    data: {
      Activities: { connect: [{ id: activityId }] },
    },
  });
}

async function deleteTicketActivity(id: number, activityId: number) {
  return prisma.ticket.update({
    where: { id },
    data: {
      Activities: { disconnect: [{ id: activityId }] },
    },
  });
}

const activityRepository = {
  findActivitiesByDate,
  findActivityLocations,
  findActivityById,
  reduceActivitySeats,
  createTicketActivity,
  deleteTicketActivity,
  incrementActivitySeats,
  findTicketActivity,
  searchConflicTicketActivities,
};

export default activityRepository;
