import { PrismaClient } from '@prisma/client';

async function createHotels(prisma: PrismaClient) {
  await prisma.hotel.createMany({
    data: [
      {
        name: 'Hotel da Peppa',
        image: 'https://images.uncyc.org/pt/thumb/6/6e/Casa_da_peppa.png/600px-Casa_da_peppa.png',
      },
      {
        name: 'Hogwarts',
        image:
          'https://cdn.falauniversidades.com.br/wp-content/uploads/2019/06/Hogwarts-School-of-Witchcraft-and-Wizardry.jpg',
      },
      {
        name: 'Heanvenly palace',
        image: 'https://i.pinimg.com/550x/02/8c/e3/028ce3de4fcc71dc130d17fec02bcfdc.jpg',
      },
    ],
  });

  return await prisma.hotel.findMany();
}

const hotelsSeed = {
  createHotels,
};

export default hotelsSeed;
