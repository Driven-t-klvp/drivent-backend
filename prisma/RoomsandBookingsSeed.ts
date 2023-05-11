import { Hotel, PrismaClient } from '@prisma/client';

async function create1(prisma: PrismaClient, hotelId: number, userId: number) {
  await prisma.room.createMany({
    data: [
      {
        name: '1',
        capacity: 1,
        hotelId,
      },
      {
        name: '2',
        capacity: 1,
        hotelId,
      },
      {
        name: '3',

        capacity: 1,
        hotelId,
      },
    ],
  });

  let { id: roomId } = await prisma.room.create({
    data: {
      name: '4',
      hotelId,
      capacity: 1,
    },
  });

  await prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });

  await prisma.room.createMany({
    data: [
      {
        name: '5',
        capacity: 1,
        hotelId,
      },
      {
        name: '6',
        capacity: 1,
        hotelId,
      },
      {
        name: '7',

        capacity: 1,
        hotelId,
      },
    ],
  });

  return prisma.room.findMany();
}

async function create2(prisma: PrismaClient, hotelId: number, userId: number) {
  await prisma.room.createMany({
    data: [
      {
        name: '1',
        hotelId,
        capacity: 3,
      },
      {
        name: '2',
        hotelId,
        capacity: 2,
      },
      {
        name: '3',
        hotelId,
        capacity: 2,
      },
    ],
  });

  let { id: roomId } = await prisma.room.create({
    data: {
      name: '4',
      hotelId,
      capacity: 3,
    },
  });

  await prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });

  await prisma.room.createMany({
    data: [
      {
        name: '5',
        hotelId,
        capacity: 2,
      },
      {
        name: '6',
        hotelId,
        capacity: 3,
      },
      {
        name: '7',
        hotelId,
        capacity: 2,
      },
      {
        name: '8',
        hotelId,
        capacity: 2,
      },
      {
        name: '9',
        hotelId,
        capacity: 2,
      },
    ],
  });

  let { id: roomId2 } = await prisma.room.create({
    data: {
      name: '10',
      hotelId,
      capacity: 3,
    },
  });

  await prisma.booking.create({
    data: {
      roomId: roomId2,
      userId,
    },
  });
}

async function create3(prisma: PrismaClient, hotelId: number, userId: number) {
  await prisma.room.createMany({
    data: [
      {
        name: '1',
        hotelId,
        capacity: 1,
      },
      {
        name: '2',
        hotelId,
        capacity: 2,
      },
      {
        name: '3',
        hotelId,
        capacity: 1,
      },
    ],
  });

  let { id: roomId } = await prisma.room.create({
    data: {
      name: '4',
      hotelId,
      capacity: 2,
    },
  });

  await prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });

  await prisma.room.createMany({
    data: [
      {
        name: '5',
        hotelId,
        capacity: 1,
      },
      {
        name: '6',
        hotelId,
        capacity: 3,
      },
      {
        name: '7',
        hotelId,
        capacity: 2,
      },
      {
        name: '8',
        hotelId,
        capacity: 2,
      },
      {
        name: '9',
        hotelId,
        capacity: 2,
      },
    ],
  });

  let { id: roomId2 } = await prisma.room.create({
    data: {
      name: '10',
      hotelId,
      capacity: 2,
    },
  });

  await prisma.booking.create({
    data: {
      roomId: roomId2,
      userId,
    },
  });

  await prisma.room.createMany({
    data: [
      {
        name: '11',
        hotelId,
        capacity: 3,
      },
      {
        name: '12',
        hotelId,
        capacity: 1,
      },
      {
        name: '13',
        hotelId,
        capacity: 1,
      },
      {
        name: '14',
        hotelId,
        capacity: 2,
      },
      {
        name: '15',
        hotelId,
        capacity: 2,
      },
    ],
  });

  return;
}

async function createRoomsandBookings(prisma: PrismaClient, hotels: Hotel[]) {
  const [hotel1, hotel2, hotel3] = hotels;

  let fakeUser = await prisma.user.findUnique({
    where: {
      email: 'john@doe.com',
    },
  });

  if (!fakeUser) {
    fakeUser = await prisma.user.create({
      data: {
        email: 'john@doe.com',
        password: 'password',
      },
    });
  }
  await create1(prisma, hotel1.id, fakeUser.id);
  await create2(prisma, hotel2.id, fakeUser.id);
  await create3(prisma, hotel3.id, fakeUser.id);

  return;
}

const roomsSeed = {
  createRoomsandBookings,
};

export default roomsSeed;
