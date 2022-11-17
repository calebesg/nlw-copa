import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/pools/:id/games',
    { onRequest: [authenticate] },
    async request => {
      const getPoolParam = z.object({
        id: z.string(),
      })

      const { id } = getPoolParam.parse(request.params)

      const games = await prisma.game.findMany({
        orderBy: {
          date: 'desc',
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId: id,
              },
            },
          },
        },
      })

      return {
        games: games.map(game => {
          return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            firstTeamCountryCode: game.firstTermCountryCode,
            secondTeamCountryCode: game.secondTermCountryCode,
            guesses: undefined,
            firstTermCountryCode: undefined,
            secondTermCountryCode: undefined,
          }
        }),
      }
    }
  )
}
