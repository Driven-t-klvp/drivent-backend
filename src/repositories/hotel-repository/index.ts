import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelsWithRoomsandBookingIds() {
  return prisma.hotel.findMany({
    include: {
      Rooms: {
        include: {
          Booking: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomsWithBooking(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
    // se the amount of booking each room has
    include: {
      Booking: {
        select: {
          id: true,
        },
      },
    },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomsWithBooking,
  findHotelsWithRoomsandBookingIds,
};

export default hotelRepository;
