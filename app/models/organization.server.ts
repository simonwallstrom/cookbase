import type { Organization } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getOrganizationById(id: Organization['id']) {
  return prisma.organization.findUnique({
    where: { id },
  })
}

export async function getMembersById(id: Organization['id']) {
  return await prisma.user.findMany({
    where: { organizationId: id },
    select: {
      email: true,
      firstName: true,
      role: true,
      id: true,
      _count: true,
    },
    orderBy: [
      {
        role: 'asc',
      },
    ],
  })
}
