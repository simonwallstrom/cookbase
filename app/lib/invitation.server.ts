import type { Invitation, Organization } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getInvitation(organizationId: Organization['id']) {
  return prisma.invitation.findFirst({
    where: {
      organizationId,
    },
    select: {
      id: true,
    },
  })
}

export async function getInviteById(id: Invitation['id']) {
  return prisma.invitation.findUnique({
    where: { id },
    select: {
      id: true,
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function resetInvitation(
  organizationId: Organization['id'],
  invitationId: Invitation['id'],
) {
  return prisma.$transaction([
    prisma.invitation.delete({
      where: {
        id: invitationId,
        organizationId,
      },
    }),
    prisma.invitation.create({
      data: {
        organizationId,
      },
    }),
  ])
}
