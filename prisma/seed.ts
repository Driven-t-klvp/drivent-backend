import { PrismaClient, Ticket } from '@prisma/client';
import dayjs from 'dayjs';
import faker from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';

import hotelsSeed from './HotelsSeed';
import roomsSeed from './RoomsandBookingsSeed';
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
  if (!presencialTicketType) {
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

  //Comente ou altera essa parte do seed caso não queira enrrolment inserido
  await prisma.enrollment.deleteMany();

  let enrollment = await prisma.enrollment.findFirst({ where: { userId: user.id } });
  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        name: faker.name.findName(),
        cpf: generateCPF(),
        birthday: faker.date.past(),
        phone: faker.phone.phoneNumber('(##) 9####-####'),
        userId: user.id,
        Address: {
          create: {
            street: faker.address.streetName(),
            cep: faker.address.zipCode(),
            city: faker.address.city(),
            neighborhood: faker.address.city(),
            number: faker.datatype.number().toString(),
            state: faker.helpers.arrayElement(getStates()).name,
          },
        },
      },
      include: {
        Address: true,
      },
    });
  }


  //Comente ou altera essa parte do seed caso não queira inserir ticket RESERVED
  await prisma.ticket.deleteMany();

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
        status: 'RESERVED',
      },
      include: {
        TicketType: true,
      },
    });
  }

  let hotels = await prisma.hotel.findMany();
  if (!hotels || hotels.length === 0) {
    hotels = await hotelsSeed.createHotels(prisma);
  }

  let rooms = await prisma.room.findMany();
  if (!rooms || rooms.length === 0) {
    await roomsSeed.createRoomsandBookings(prisma, hotels);
  }

  console.log({ event });
  console.log({ remoteTicketType });
  console.log({ presencialTicketType });
  console.log({ hotelTicketType });
  console.log({ user });
  console.log({ enrollment });
  console.log({ ticketWithHotel });
  console.log({ hotels });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
