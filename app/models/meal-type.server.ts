import type { Organization } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getMealTypes(organizationId: Organization['id']) {
  return await prisma.mealType.findMany({
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
      order: 'asc',
    },
  })
}
