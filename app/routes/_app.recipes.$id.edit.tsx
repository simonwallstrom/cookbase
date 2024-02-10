import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { Select } from '~/components/select'
import { Textarea } from '~/components/textarea'
import { requireAuth } from '~/lib/auth.server'
import { prisma } from '~/lib/prisma.server'
import { getCuisines } from '~/models/cuisine.server'
import { getMealTypes } from '~/models/meal-type.server'
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

  const mealTypes = await getMealTypes(orgId)
  const cuisines = await getCuisines(orgId)

  return json({ recipe, mealTypes, cuisines })
}

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  mealTypeId: z.string().cuid(),
  cuisineId: z.string().cuid(),
  servings: z.coerce.number().positive(),
  ingredients: z.string().min(1, 'Ingredients are required'),
  instructions: z.string().min(1, 'Instructions are required'),
})

export async function action({ request, params }: ActionFunctionArgs) {
  const { orgId, userId } = await requireAuth(request)
  const recipeId = z.string().cuid().safeParse(params.id)

  if (!recipeId.success) {
    throw new Response('Recipe not found', { status: 404, statusText: 'Not found' })
  }

  const formData = await request.formData()

  const result = schema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  const recipe = await prisma.recipe.update({
    where: { id: recipeId.data },
    data: { ...result.data, userId, organizationId: orgId },
  })

  return redirect(`/recipes/${recipe.id}`)
}

export default function Home() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div className="max-w-2xl">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Edit recipe</h1>
        <p className="text-gray-500">
          Update the form below to edit the recipe or{' '}
          <Link to={`/recipes/${data.recipe.id}`}>click here to cancel</Link>.
        </p>
      </div>

      {/* Recipe form */}
      <Form method="post" className="mt-4 md:mt-8">
        <div className="grid gap-1.5">
          <label className="font-medium" htmlFor="title">
            Title
          </label>
          <Input defaultValue={data.recipe.title} type="text" required name="title" id="title" />
          {actionData?.errors?.fieldErrors.title ? (
            <div className="text-sm text-red-600">{actionData?.errors?.fieldErrors.title}</div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-x-6">
          <div className="mt-4 grid flex-grow gap-1.5 md:mt-8">
            <label className="font-medium" htmlFor="mealType">
              Meal type
            </label>
            <Select defaultValue={data.recipe.mealTypeId} id="mealType" name="mealTypeId">
              <option value="">Select meal type...</option>
              {data.mealTypes.map((mealType) => (
                <option key={mealType.id} value={mealType.id}>
                  {mealType.name} ({mealType._count.recipes})
                </option>
              ))}
            </Select>
            {actionData?.errors?.fieldErrors.mealTypeId ? (
              <div className="text-sm text-red-600">
                {actionData?.errors?.fieldErrors.mealTypeId}
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid flex-grow gap-1.5 md:mt-8">
            <label className="font-medium" htmlFor="cuisine">
              Cuisine
            </label>
            <Select defaultValue={data.recipe.cuisineId} id="cuisine" name="cuisineId">
              <option value="">Select cuisine...</option>
              {data.cuisines.map((cuisine) => (
                <option key={cuisine.id} value={cuisine.id}>
                  {cuisine.name} ({cuisine._count.recipes})
                </option>
              ))}
            </Select>
            {actionData?.errors?.fieldErrors.cuisineId ? (
              <div className="text-sm text-red-600">
                {actionData?.errors?.fieldErrors.cuisineId}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-1.5 md:mt-8">
          <label className="font-medium" htmlFor="servings">
            Servings
          </label>
          <Input defaultValue={data.recipe.servings} type="number" name="servings" id="servings" />
          {actionData?.errors?.fieldErrors.servings ? (
            <div className="text-sm text-red-600">{actionData?.errors?.fieldErrors.servings}</div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-1.5 md:mt-8">
          <label className="font-medium" htmlFor="ingredients">
            Ingredients
          </label>
          <Textarea
            defaultValue={data.recipe.ingredients}
            placeholder={`Tomato sauce:\nSalt...\nPepper...\nGarlic...`}
            id="ingredients"
            rows={8}
            name="ingredients"
          />
          <div className="text-sm text-gray-500">
            One ingredient per row. Add headings with a colon mark – e.g.{' '}
            <span className="whitespace-nowrap rounded-sm bg-gray-100 px-1 py-0.5 leading-relaxed dark:bg-gray-800">
              Tomato sauce:
            </span>
          </div>
          {actionData?.errors?.fieldErrors.ingredients ? (
            <div className="text-sm text-red-600">
              {actionData?.errors?.fieldErrors.ingredients}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-1.5 md:mt-8">
          <label className="font-medium" htmlFor="instructions">
            Instructions
          </label>
          <Textarea
            defaultValue={data.recipe.instructions}
            placeholder={`Tomato sauce:\nSalt...\nPepper...\nGarlic...`}
            id="instructions"
            rows={8}
            name="instructions"
          />
          <div className="text-sm text-gray-500">
            One step per row. Add headings with a colon mark – e.g.{' '}
            <span className="whitespace-nowrap rounded-sm bg-gray-100 px-1 py-0.5 leading-relaxed dark:bg-gray-800">
              Tomato sauce:
            </span>
          </div>
          {actionData?.errors?.fieldErrors.instructions ? (
            <div className="text-sm text-red-600">
              {actionData?.errors?.fieldErrors.instructions}
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex items-center gap-6 font-medium md:mt-10 md:gap-10">
          <Button>Create recipe</Button>
          <Link to="/recipes">Cancel</Link>
        </div>
      </Form>
    </div>
  )
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
