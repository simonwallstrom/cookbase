import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { z } from 'zod'
import { Link } from '~/components/link'
import { requireAuth } from '~/lib/auth.server'
import { getRecipe } from '~/models/recipe.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { orgId } = await requireAuth(request)
  const recipeId = z.string().cuid().safeParse(params.id)

  if (!recipeId.success) {
    throw new Response('Recipe not found', { status: 404, statusText: 'Not found' })
  }

  const recipe = await getRecipe({ organizationId: orgId, id: recipeId.data })

  if (!recipe) {
    throw new Response('Recipe not found', { status: 404 })
  }

  return json({ recipe })
}

export default function RecipeId() {
  const { recipe } = useLoaderData<typeof loader>()
  const ingredients = recipe.ingredients?.split(/\r?\n/).filter((item) => item.length)
  const instructions = recipe.instructions?.split(/\r?\n/).filter((item) => item.length)

  return (
    <div className="mx-auto mb-64 w-full max-w-7xl p-6 sm:p-12">
      {/* Page header */}
      <header className="flex w-full items-center justify-between gap-6 font-medium">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/recipes">Recipes</Link>
          <span>/</span>
          <span className="truncate text-gray-500">Lax med potatis och romsås</span>
        </div>
        <button className="underline-offset-4 hover:underline">Edit</button>
      </header>

      <div className="mt-6 border-t pt-12 sm:mt-12 sm:pt-20">
        <div className="text-gray-500">
          <span>Created</span>{' '}
          <span>{formatDistanceToNowStrict(new Date(recipe.createdAt))} ago</span>
        </div>
        <h1 className="mt-3 text-balance text-3xl font-bold sm:mt-5 sm:text-4xl md:text-5xl">
          {recipe.title}
        </h1>
        <div className="mt-5 flex flex-col flex-wrap gap-x-8 gap-y-2 sm:mt-7 md:flex-row">
          {recipe.mealType?.name.length ? (
            <div className="flex gap-3">
              <span className="text-gray-500 max-md:w-24">Meal type</span>{' '}
              <Link to={`/recipes/?mealType=${recipe.mealType?.name}`}>
                {recipe.mealType?.name}
              </Link>
            </div>
          ) : null}
          {recipe.mealType?.name.length ? (
            <div className="flex gap-3">
              <span className="text-gray-500 max-md:w-24">Cuisine</span>{' '}
              <Link to={`/recipes/?cuisine=${recipe.cuisine?.name}`}>{recipe.cuisine?.name}</Link>
            </div>
          ) : null}
          <div className="flex gap-3">
            <span className="text-gray-500 max-md:w-24">Member</span>{' '}
            <Link to={`/recipes/?member=${recipe.user.firstName}`}>{recipe.user.firstName}</Link>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start gap-12 border-t pt-12 sm:mt-20 md:flex-row xl:gap-24">
        <div className="w-full md:w-64 lg:w-80">
          {/* Ingredients */}
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            {recipe.servings ? (
              <span className="text-gray-500">
                {recipe.servings} {recipe.servings > 1 ? 'servings' : 'serving'}
              </span>
            ) : null}
          </div>

          {ingredients?.length ? (
            <ul className="mt-4 list-inside divide-y divide-dashed border-y border-dashed">
              {ingredients.map((ingredient, index) => (
                <IngredientItem key={index} val={ingredient} />
              ))}
            </ul>
          ) : (
            <div className="mt-4 border border-dashed px-4 py-12 text-center dark:border-gray-800">
              <Link to="edit">Add ingredients →</Link>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Instructions</h2>
          {instructions?.length ? (
            <ol className="[counter-reset:ingredients-list]">
              {instructions.map((instruction, index) => (
                <InstructionItem key={index} val={instruction} />
              ))}
            </ol>
          ) : (
            <div className="mt-4 border border-dashed px-4 py-12 text-center dark:border-gray-800">
              <Link to="edit">Add instructions →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const IngredientItem = ({ val }: { val: string }) => {
  if (val.endsWith(':') || val.trimEnd().endsWith(':')) {
    return <li className="py-2 font-semibold">{val}</li>
  } else {
    return <li className="text-gray-1100 py-2">{val}</li>
  }
}

const InstructionItem = ({ val }: { val: string }) => {
  if (val.endsWith(':') || val.trimEnd().endsWith(':')) {
    return <li className="mt-6 font-medium">{val}</li>
  } else {
    return (
      <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-medium before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
        {val}
      </li>
    )
  }
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="font-medium text-red-400">
          {error.status} {error.statusText}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold sm:mt-5 sm:text-4xl md:text-5xl">
          {error.data}
        </h1>
        <div className="mt-7">
          <Link to="/recipes">← Back to all recipes</Link>
        </div>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
