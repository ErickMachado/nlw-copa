import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      avatarUrl: "https://avatars.githubusercontent.com/u/63971106?v=4",
      email: "johndoe@gmail.com",
      name: "John Doe",
    },
  });
  const pool = await prisma.pool.create({
    data: {
      title: "Example pool",
      code: "BOL123",
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-04T15:08:14.181Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-03T15:08:14.181Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 0,
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
  });
}

main();
