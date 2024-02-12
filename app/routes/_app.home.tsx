import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { Link } from '~/components/link'
import { requireAuth } from '~/lib/auth.server'
import { getMembersById } from '~/models/organization.server'
import { getRecipeCount } from '~/models/recipe.server'
import { getUserById } from '~/models/user.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, orgId } = await requireAuth(request)
  const user = await getUserById(userId)
  const members = await getMembersById(orgId)
  const recipeCount = await getRecipeCount(orgId)

  return json({ user, members, recipeCount })
}

export default function Settings() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="grid">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl/tight">
          Hi {data.user?.firstName} 👋
        </h1>
        <p className="mt-2 text-balance">Nice to see you again! What are you cooking today?</p>
        {/* <p className="mt-2 text-balance">
            You belong to the account{' '}
            <span className="font-medium">{data.user?.organization.name}</span>. Your family have a
            total of{' '}
            <span className="font-medium">
              {data.recipeCount?.totalCount}{' '}
              {data.recipeCount?.totalCount === 1 ? 'recipe' : 'recipes'}
            </span>{' '}
            so far.
          </p> */}
      </div>

      <div className="mt-6 grid gap-6 sm:mt-12 sm:gap-12 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 text-center sm:p-12 dark:bg-gray-900">
          <h2 className="font-medium text-gray-500">Total recipes</h2>
          <h1 className="my-3 text-3xl font-bold sm:text-4xl md:text-6xl/none">138</h1>
          <Link to="/recipes">View all recipes</Link>
        </div>
        <div className="bg-gray-100 p-6 sm:p-12 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Top meal types</h2>
          <div className="mt-4 divide-y divide-dashed border-y border-dashed">
            <div className="flex items-center justify-between py-2">
              <p>Weeknight dinners</p>
              <div className="text-sm text-gray-500">24 recipes</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <p>Main courses</p>
              <div className="text-sm text-gray-500">22 recipes</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <p>Breakfast</p>
              <div className="text-sm text-gray-500">17 recipes</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-6 sm:p-12 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Top cuisines</h2>
          <div className="mt-4 divide-y divide-dashed border-y border-dashed">
            <div className="flex items-center justify-between py-2">
              <p>Weeknight dinners</p>
              <div className="text-sm text-gray-500">24 recipes</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <p>Main courses</p>
              <div className="text-sm text-gray-500">22 recipes</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <p>Breakfast</p>
              <div className="text-sm text-gray-500">17 recipes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:mt-12 sm:gap-12">
        <div className="bg-gray-100 p-6 sm:p-12 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Recent activity</h2>
          <p className="mt-2 text-pretty text-gray-600 dark:text-gray-400">
            Here is a summary of what happened on your account lately.
          </p>
          <div className="mt-6 divide-y divide-dashed border-y border-dashed">
            <div className="py-3">
              <div className="text-sm text-gray-500">2 hours ago</div>
              <p>You added the recipe Smash burgers</p>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">3 days ago</div>
              <p>Lisa added the recipe Taquitos</p>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">4 days ago</div>
              <p>Lisa left a comment on your recipe Lasagne med soltorkade tomater</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}