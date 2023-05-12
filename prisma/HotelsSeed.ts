import { PrismaClient } from '@prisma/client';

async function createHotels(prisma: PrismaClient) {
  await prisma.hotel.createMany({
    data: [
      {
        name: 'Hotel da Peppa',
        image:
          'https://static.wikia.nocookie.net/peppapedia/images/6/62/Casa_da_peppa.jpg/revision/latest/scale-to-width-down/350?cb=20170127184613&path-prefix=pt-br',
      },
      {
        name: 'Hogwarts',
        image:
          'https://cdn.falauniversidades.com.br/wp-content/uploads/2019/06/Hogwarts-School-of-Witchcraft-and-Wizardry.jpg',
      },
      {
        name: 'Xablau',
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
