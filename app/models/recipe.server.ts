import type { Organization, Recipe } from '@prisma/client'
import { PAGINATE_BY } from '~/lib/constants'
import { prisma } from '~/lib/prisma.server'
import type { filterSchema } from '~/routes/_app.recipes._index'

function parseFilters(input: string | undefined) {
  if (input === 'all' || undefined) {
    return undefined
  }
  return input
}

export async function getRecipeCount(organizationId: Organization['id'], filters?: filterSchema) {
  console.log(organizationId)
  const totalCount = await prisma.recipe.count({
    where: {
      organizationId,
    },
  })

  const filteredCount = await prisma.recipe.count({
    where: {
      organizationId,
      mealType: {
        name: parseFilters(filters?.mealType),
      },
      cuisine: {
        name: parseFilters(filters?.cuisine),
      },
      user: {
        firstName: parseFilters(filters?.member),
      },
    },
  })

  return { totalCount, filteredCount }
}

export async function getRecipes(organizationId: Organization['id'], filters: filterSchema) {
  const take = PAGINATE_BY
  const skip = filters.page ? take * (filters.page - 1) : undefined

  return prisma.recipe.findMany({
    where: {
      organizationId,
      mealType: {
        name: parseFilters(filters.mealType),
      },
      cuisine: {
        name: parseFilters(filters.cuisine),
      },
      user: {
        firstName: parseFilters(filters.member),
      },
    },
    include: {
      mealType: true,
      cuisine: true,
      user: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: take,
    skip: skip,
  })
}

export async function getRecipe({
  organizationId,
  id,
}: {
  organizationId: Organization['id']
  id: Recipe['id']
}) {
  return prisma.recipe.findFirst({
    where: { id, organizationId },
    include: {
      mealType: true,
      cuisine: true,
      user: true,
    },
  })
}
