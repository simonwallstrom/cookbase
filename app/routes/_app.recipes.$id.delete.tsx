import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Link } from '~/components/link'
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
  id: z.string().cuid(),
  title: z.string(),
})

export async function action({ request, params }: ActionFunctionArgs) {
  const { orgId, userId } = await requireAuth(request)
  const formData = await request.formData()
  const title = formData.get('title')
  const result = schema.safeParse({ id: params.id, title })

  if (!result.success) {
    throw new Response('Recipe not found', { status: 404, statusText: 'Not found' })
  }

  try {
    await prisma.$transaction([
      prisma.activity.create({
        data: {
          userId,
          organizationId: orgId,
          type: 'RECIPE',
          recipeName: result.data.title,
        },
      }),
      prisma.recipe.delete({
        where: {
          id: result.data.id,
        },
      }),
    ])
  } catch (e) {
    throw new Response('An unexpected error occurred', { status: 500 })
  }

  return redirect('/recipes/')
}

export default function Home() {
  const data = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <div className="max-w-2xl">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Delete recipe</h1>
        <p className="text-gray-500">
          Are you sure you want to delete the recipe {'"'}
          <span className="text-gray-600 dark:text-gray-400">{data.recipe.title}</span>
          {'"'}?
        </p>
      </div>

      {/* Recipe form */}
      <Form method="post" className="mt-4 md:mt-8">
        <div className="mt-6 flex items-center gap-6 font-medium md:mt-10">
          <input type="hidden" name="title" value={data.recipe.title} />
          <Button disabled={navigation.state !== 'idle'}>Delete recipe</Button>
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
      <div>
        <h1 className="flex gap-2 text-balance text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl">
          <span className="text-gray-500">{error.status}</span>
          <span>{error.data}</span>
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
