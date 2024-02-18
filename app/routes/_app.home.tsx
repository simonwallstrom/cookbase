import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData, useSearchParams } from '@remix-run/react'
import { Link } from '~/components/link'
import { requireAuth } from '~/lib/auth.server'
import { getTopCuisines } from '~/models/cuisine.server'
import { getTopMealTypes } from '~/models/meal-type.server'
import { getMembersById } from '~/models/organization.server'
import { getRecipeCount } from '~/models/recipe.server'
import { getUserById } from '~/models/user.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, orgId } = await requireAuth(request)
  const user = await getUserById(userId)
  const members = await getMembersById(orgId)
  const recipeCount = await getRecipeCount(orgId)
  const topMealTypes = await getTopMealTypes(orgId)
  const topCuisines = await getTopCuisines(orgId)

  return json({ user, members, recipeCount, topMealTypes, topCuisines })
}

export default function Settings() {
  const data = useLoaderData<typeof loader>()
  const [params] = useSearchParams()
  const newOwner = params.has('new-owner')
  const newMember = params.has('new-member')

  return (
    <div className="grid">
      <div>
        <h1 className="text-5xl font-semibold tracking-tight">Hi {data.user?.firstName} 👋</h1>
        {newOwner ? (
          <p className="mt-3 text-balance">
            Welcome to Cookbase! Get started by creating your first recipe.
          </p>
        ) : newMember ? (
          <p className="mt-3 text-balance">
            You successfully joined {data.user?.organization.name}. What are you cooking today?
          </p>
        ) : (
          <p className="mt-3 text-balance">Nice to see you again! What are you cooking today?</p>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:mt-12 sm:gap-12 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 text-center sm:p-12 dark:border dark:bg-gray-900">
          <h2 className="font-medium text-gray-500">Total recipes</h2>
          <h1 className="my-3 text-3xl font-bold sm:text-4xl md:text-6xl/none">
            {data.recipeCount.totalCount}
          </h1>
          {data.recipeCount.totalCount === 0 ? (
            <Link prefetch="intent" to="/recipes/new">
              Create your first recipe
            </Link>
          ) : (
            <Link prefetch="intent" to="/recipes">
              View all recipes
            </Link>
          )}
        </div>
        <div className="bg-gray-100 p-6 sm:p-12 dark:border dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Top meal types</h2>
          <div className="mt-4 border-t border-dashed">
            {data.topMealTypes.length ? (
              <>
                {data.topMealTypes.map((mealType) => (
                  <div
                    key={mealType.id}
                    className="flex items-center justify-between border-b border-dashed py-2"
                  >
                    <Link to={`/recipes?mealType=${mealType.name}`}>{mealType.name}</Link>
                    <div className="text-sm text-gray-500">
                      {mealType._count.recipes}{' '}
                      {mealType._count.recipes === 1 ? 'recipe' : 'recipes'}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="mt-4 text-gray-500">
                Start creating recipes and see which meal types are most popular.
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-100 p-6 sm:p-12 dark:border dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Top cuisines</h2>
          <div className="mt-4 border-t border-dashed">
            {data.topCuisines.length ? (
              <>
                {data.topCuisines.map((cuisine) => (
                  <div
                    key={cuisine.id}
                    className="flex items-center justify-between border-b border-dashed py-2"
                  >
                    <Link to={`/recipes?cuisine=${cuisine.name}`}>{cuisine.name}</Link>
                    <div className="text-sm text-gray-500">
                      {cuisine._count.recipes} {cuisine._count.recipes === 1 ? 'recipe' : 'recipes'}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="mt-4 text-gray-500">
                Start creating recipes and see which cuisines are most popular.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-12">
        <div className="bg-gray-100 p-6 sm:p-12 dark:border dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Recent activity</h2>
          <p className="mt-2 text-pretty text-gray-600 dark:text-gray-400">
            Here is a summary of what happened on your account lately.
          </p>
          <div className="mt-6 divide-y divide-dashed border-y border-dashed">
            <div className="py-3">
              <div className="text-sm text-gray-500">2 hours ago</div>
              <p>
                You added the recipe <Link to="/home">Smash burgers</Link>
              </p>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">3 days ago</div>
              <p>
                Lisa added the recipe <Link to="/home">Taquitos</Link>
              </p>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">4 days ago</div>
              <p>
                Lisa left a <Link to="/home">comment</Link> on your recipe{' '}
                <Link to="/home">Lasagne med soltorkade tomater</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
