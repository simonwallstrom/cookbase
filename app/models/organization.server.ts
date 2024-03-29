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
      lastName: true,
      id: true,
      _count: {
        select: {
          recipes: true,
        },
      },
    },
    orderBy: [
      {
        firstName: 'asc',
      },
    ],
  })
}

export async function updateOrganizationName(
  orgId: Organization['id'],
  name: Organization['name'],
) {
  const organization = await prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      name: name,
    },
  })

  return organization
}
