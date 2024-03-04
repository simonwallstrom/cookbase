import type { Organization } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getActivity({ organizationId }: { organizationId: Organization['id'] }) {
  return await prisma.activity.findMany({
    where: { organizationId },
    select: {
      id: true,
      createdAt: true,
      type: true,
      recipeName: true,
      user: {
        select: {
          id: true,
          firstName: true,
        },
      },
      recipe: {
        select: {
          id: true,
          title: true,
        },
      },
      note: {
        select: {
          id: true,
        },
      },
    },
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  })
}
