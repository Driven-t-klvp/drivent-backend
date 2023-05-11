import { PrismaClient, Ticket } from '@prisma/client';
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

  let remoteTicketType = await prisma.ticketType.findFirst({
    where: {
      isRemote: true,
      includesHotel: false,
    },
  });
  if (!remoteTicketType) {
    remoteTicketType = await prisma.ticketType.create({
      data: {
        name: 'online ticket',
        price: 100,
        isRemote: true,
        includesHotel: false,
      },
    });
  }

  let presencialTicketType = await prisma.ticketType.findFirst({
    where: {
      isRemote: false,
      includesHotel: false,
    },
  });
  if (presencialTicketType) {
    presencialTicketType = await prisma.ticketType.create({
      data: {
        name: 'Presencial sem hotel',
        price: 250,
        isRemote: false,
        includesHotel: false,
      },
    });
  }

  let hotelTicketType = await prisma.ticketType.findFirst({
    where: {
      isRemote: false,
      includesHotel: true,
    },
  });
  if (!hotelTicketType) {
    hotelTicketType = await prisma.ticketType.create({
      data: {
        name: 'Presencial com hotel',
        price: 350,
        isRemote: false,
        includesHotel: true,
      },
    });
  }

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@gmail.com',
        password: '123456',
      },
    });
  }

  let enrollment = await prisma.enrollment.findFirst({ where: { userId: user.id } });
  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        name: 'John Travolta',
        cpf: '47424943006',
        birthday: new Date('1990-05-04'),
        phone: '129985430293',
        userId: user.id,
      },
    });
  }

  let ticketWithHotel = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollment.id,
      TicketType: {
        includesHotel: true,
      },
    },
    include: {
      TicketType: true,
    },
  });
  if (!ticketWithHotel) {
    ticketWithHotel = await prisma.ticket.create({
      data: {
        ticketTypeId: hotelTicketType.id,
        enrollmentId: enrollment.id,
        status: 'PAID',
      },
      include: {
        TicketType: true,
      },
    });
  }

  console.log({ event });
  console.log({ remoteTicketType });
  console.log({ presencialTicketType });
  console.log({ hotelTicketType });
  console.log({ user });
  console.log({ enrollment });
  console.log({ ticketWithHotel });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
