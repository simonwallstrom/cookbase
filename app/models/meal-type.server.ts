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

export async function getTopMealTypes(organizationId: Organization['id']) {
  return await prisma.mealType.findMany({
    where: {
      recipes: {
        some: {
          organizationId,
        },
      },
    },
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
      recipes: {
        _count: 'desc',
      },
    },
    take: 3,
  })
}
