import type { Note, Organization, Recipe, User } from '@prisma/client'
import { prisma } from '~/lib/prisma.server'

export async function getNotes({
  organizationId,
  recipeId,
  showResolvedNotes,
}: {
  organizationId: Organization['id']
  recipeId: Recipe['id']
  showResolvedNotes?: Note['isResolved']
}) {
  return await prisma.note.findMany({
    where: { organizationId, recipeId, isResolved: showResolvedNotes ? undefined : false },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      createdAt: true,
      message: true,
      isResolved: true,
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

export async function updateNoteStatus({
  id,
  organizationId,
  userId,
  isResolved,
}: {
  id: Note['id']
  organizationId: Organization['id']
  userId: User['id']
  isResolved: Note['isResolved']
}) {
  return await prisma.note.update({
    where: { id, organizationId, userId },
    data: { isResolved },
  })
}
