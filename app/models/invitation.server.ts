import type { Invitation, Organization } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getInvitation(organizationId: Organization['id']) {
  return prisma.invitation.findFirst({
    where: {
      organizationId,
    },
    select: {
      id: true,
      isEnabled: true,
    },
  })
}

export async function getInviteById(id: Invitation['id']) {
  return prisma.invitation.findUnique({
    where: { id, isEnabled: true },
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

export async function toggleInvitation(
  organizationId: Organization['id'],
  invitationId: Invitation['id'],
  isEnabled: Invitation['isEnabled'],
) {
  return prisma.invitation.update({
    where: { id: invitationId, organizationId },
    data: {
      isEnabled: isEnabled,
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
