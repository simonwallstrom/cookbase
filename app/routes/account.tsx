import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, useLoaderData } from '@remix-run/react'
import { Button } from '~/components/button'
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
    <div className="mx-auto w-full max-w-7xl p-6 sm:p-12">
      <header className="flex items-center justify-between">
        <div className="font-medium text-gray-500">{data.user?.organization.name}</div>
        <Link prefetch="intent" className="font-medium" to="/recipes">
          View recipes
        </Link>
      </header>

      <div className="mt-6 grid border-t pt-6 sm:mt-12 sm:pt-12">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl/tight">
            Hi {data.user?.firstName}!
          </h1>
          <p className="mt-2 text-balance">
            You belong to the account{' '}
            <span className="font-medium">{data.user?.organization.name}</span>. Your family have a
            total of{' '}
            <span className="font-medium">
              {data.recipeCount?.totalCount}{' '}
              {data.recipeCount?.totalCount === 1 ? 'recipe' : 'recipes'}
            </span>{' '}
            so far.
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:mt-12 sm:gap-12 lg:grid-cols-2">
          <div className="bg-gray-100 p-6 sm:p-12 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold">Family account</h2>

            <p className="mt-2 text-pretty text-gray-600 dark:text-gray-400">
              Your shared information. Manage your account and invite family members.
            </p>
            <div className="mt-6 grid divide-y divide-dashed border-y border-dashed">
              <div className="flex py-3">
                <div className="w-24 text-gray-500">Name</div>
                <div className="font-medium">{data.user?.organization.name}</div>
              </div>
              <div className="flex py-3">
                <div className="w-24 text-gray-500">Members</div>
                <div className="grid gap-1 font-medium">
                  {data.members.map((member) => (
                    <div key={member.id}>
                      {member.firstName}{' '}
                      <span className="text-sm font-normal lowercase text-gray-500">
                        ({member.role})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-8 font-medium">
              <Link to="/account">Edit account</Link>
            </div>
          </div>
          <div className="bg-gray-100 p-6 sm:p-12 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold">Profile details</h2>
            <p className="mt-2 text-pretty text-gray-600 dark:text-gray-400">
              Your personal information. Update your name and email address in this section.
            </p>
            <div className="mt-6 grid divide-y divide-dashed border-y border-dashed">
              <div className="flex py-3">
                <div className="w-24 text-gray-500">Name</div>
                <div className="font-medium">
                  {data.user?.firstName} {data.user?.lastName}
                </div>
              </div>
              <div className="flex py-3">
                <div className="w-24 text-gray-500">Email</div>
                <div className="font-medium">{data.user?.email}</div>
              </div>
            </div>
            <div className="mt-6 flex gap-8 font-medium">
              <Link to="/account">Edit profile</Link>
              <Form action="/api/logout" method="post">
                <Button type="submit">Logout</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
