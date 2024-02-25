import type { Note, Organization, Recipe, User } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getNotes({
  organizationId,
  recipeId,
}: {
  organizationId: Organization['id']
  recipeId: Recipe['id']
}) {
  return await prisma.note.findMany({
    where: { organizationId, recipeId },
    select: {
      id: true,
      createdAt: true,
      message: true,
      user: {
        select: {
          id: true,
          firstName: true,
        },
      },
    },
  })
}

export async function deleteNote({
  id,
  organizationId,
  userId,
}: {
  id: Note['id']
  organizationId: Organization['id']
  userId: User['id']
}) {
  return await prisma.note.delete({
    where: { id, organizationId, userId },
  })
}
