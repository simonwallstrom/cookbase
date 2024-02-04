import type { Organization } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getCuisines(organizationId: Organization['id']) {
  return await prisma.cuisine.findMany({
    include: {
      _count: {
        select: {
          recipes: {
            where: {
              organizationId,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}
