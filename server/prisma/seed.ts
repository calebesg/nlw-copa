import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/calebesg.png',
    },
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  })

  await prisma.game.create({
    data: {
      date: '2022-11-08T12:32:38.093Z',
      firstTermCountryCode: 'DE',
      secondTermCountryCode: 'BR',
    },
  })

  await prisma.game.create({
    data: {
      date: '2022-11-08T12:32:38.093Z',
      firstTermCountryCode: 'BR',
      secondTermCountryCode: 'AR',

      guesses: {
        create: {
          firstTermPoint: 2,
          secondTermPoint: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  })
}

main()
