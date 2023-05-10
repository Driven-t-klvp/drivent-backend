import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  await prisma.ticketType.deleteMany();

  let ticketType = await prisma.ticketType.findFirst({
    where: {
      isRemote: true,
      includesHotel: false,
    },
  });
  if (!ticketType) {
    ticketType = await prisma.ticketType.create({
      data: {
        name: 'online ticket',
        price: 100,
        isRemote: true,
        includesHotel: false,
      },
    });
  }

  let ticketType2 = await prisma.ticketType.findFirst({
    where: {
      isRemote: false,
      includesHotel: false,
    },
  });
  if (!ticketType2) {
    ticketType2 = await prisma.ticketType.create({
      data: {
        name: 'Presencial sem hotel',
        price: 250,
        isRemote: false,
        includesHotel: false,
      },
    });
  }

  let ticketType3 = await prisma.ticketType.findFirst({
    where: {
      isRemote: false,
      includesHotel: true,
    },
  });
  if (!ticketType3) {
    ticketType3 = await prisma.ticketType.create({
      data: {
        name: 'Presencial com hotel',
        price: 350,
        isRemote: false,
        includesHotel: true,
      },
    });
  }

  console.log({ event });
  console.log({ ticketType });
  console.log({ ticketType2 });
  console.log({ ticketType3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
