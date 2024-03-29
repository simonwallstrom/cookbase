import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData, useSearchParams, useSubmit } from '@remix-run/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { z } from 'zod'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { Pagination } from '~/components/pagination'
import { Select } from '~/components/select'
import { requireAuth } from '~/lib/auth.server'
import { getCuisines } from '~/models/cuisine.server'
import { getMealTypes } from '~/models/meal-type.server'
import { getMembersById } from '~/models/organization.server'
import { getRecipeCount, getRecipes } from '~/models/recipe.server'
import { getUserById } from '~/models/user.server'

const schema = z.object({
  search: z.string().optional(),
  mealType: z.string().optional(),
  cuisine: z.string().optional(),
  member: z.string().optional(),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
})

export type filterSchema = z.infer<typeof schema>

export async function loader({ request }: LoaderFunctionArgs) {
  const { orgId, userId } = await requireAuth(request)
  const user = await getUserById(userId)

  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)
  const filters = schema.parse(searchParams)

  const recipes = await getRecipes(orgId, filters)
  const { totalCount, filteredCount } = await getRecipeCount(orgId, filters)
  const mealTypes = await getMealTypes(orgId)
  const cuisines = await getCuisines(orgId)
  const members = await getMembersById(orgId)

  return json({ user, recipes, totalCount, filteredCount, mealTypes, cuisines, members })
}

export default function Recipes() {
  const data = useLoaderData<typeof loader>()

  const submit = useSubmit()
  const [searchParams] = useSearchParams()

  const userSearchParams = searchParams.get('search') as string
  const mealTypeParams = searchParams.get('mealType') as string
  const cuisineParams = searchParams.get('cuisine') as string
  const memberParams = searchParams.get('member') as string

  const pageParams = searchParams.get('page')
  const currentPage = pageParams ? parseInt(pageParams) : 1

  return (
    <div>
      {/* Page header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Recipes</h1>
        <Link variant="button" prefetch="intent" to="/recipes/new">
          New
        </Link>
      </header>

      {/* Search and filter */}
      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-12 gap-y-4 sm:mt-12">
        <Form className="relative flex flex-grow items-center" method="get">
          <Input
            defaultValue={userSearchParams ? userSearchParams : ''}
            key={userSearchParams ? userSearchParams : ''}
            name="search"
            placeholder="Search recipes..."
            className="w-full"
          />
          {userSearchParams?.length ? (
            <Link to="/recipes" className="absolute right-3">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          ) : null}
        </Form>
        <Form className="flex flex-grow flex-wrap justify-between gap-4" method="get">
          <Select
            name="mealType"
            value={mealTypeParams ? mealTypeParams : 'all'}
            onChange={(e) => submit(e.currentTarget.form)}
            className="flex-grow"
          >
            <option value="all">All meal types</option>
            {data.mealTypes.map((mealType) => (
              <option
                disabled={mealType._count.recipes === 0}
                key={mealType.id}
                value={mealType.name}
              >
                {mealType.name} ({mealType._count.recipes})
              </option>
            ))}
          </Select>
          <Select
            name="cuisine"
            value={cuisineParams ? cuisineParams : 'all'}
            onChange={(e) => submit(e.currentTarget.form)}
            className="flex-grow"
          >
            <option value="all">All cuisines</option>
            {data.cuisines.map((cuisine) => (
              <option disabled={cuisine._count.recipes === 0} key={cuisine.id} value={cuisine.name}>
                {cuisine.name} ({cuisine._count.recipes})
              </option>
            ))}
          </Select>
          <Select
            name="member"
            value={memberParams ? memberParams : 'all'}
            onChange={(e) => submit(e.currentTarget.form)}
            className="flex-grow"
          >
            <option value="all">All members</option>
            {data.members.map((member) => (
              <option
                disabled={member._count.recipes === 0}
                key={member.id}
                value={member.firstName}
              >
                {member.firstName} ({member._count.recipes})
              </option>
            ))}
          </Select>
        </Form>
      </div>

      {/* Filter info */}
      {mealTypeParams || cuisineParams || memberParams || userSearchParams ? (
        <div className="mt-4 flex items-center justify-between border border-dashed bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
          <span className="text-gray-500">
            Your {userSearchParams ? 'search' : 'filter'} matched {data.filteredCount} of{' '}
            {data.totalCount} recipes
          </span>
          <Link prefetch="intent" className="font-medium" to="/recipes">
            Reset
          </Link>
        </div>
      ) : null}

      {/* Recipe list */}
      {data.recipes.length ? (
        <div className="mt-6 overflow-x-scroll sm:mt-8">
          <table className="min-w-full divide-y border-b">
            <thead className="max-lg:hidden">
              <tr>
                <th className="whitespace-nowrap py-4 pr-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>Title</span>
                  </div>
                </th>
                <th className="whitespace-nowrap px-3 py-4 text-left font-medium text-gray-500">
                  Meal type
                </th>
                <th className="whitespace-nowrap px-3 py-4 text-left font-medium text-gray-500">
                  Cuisine
                </th>
                <th className="whitespace-nowrap px-3 py-4 text-left font-medium text-gray-500">
                  Created by
                </th>
                <th className="whitespace-nowrap py-4 pl-3 text-right font-medium text-gray-500">
                  Last updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recipes.map((recipe) => (
                <tr className="group" key={recipe.id}>
                  <td className="py-3 lg:py-4 lg:pr-3">
                    <div className="lg:min-w-80">
                      <Link
                        prefetch="intent"
                        title={recipe.title}
                        to={`/recipes/${recipe.id}`}
                        className="min-w-0 font-medium max-lg:block"
                      >
                        <span className="lg:line-clamp-1">{recipe.title}</span>
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 max-lg:hidden">
                    <Link prefetch="intent" to={`?mealType=${recipe.mealType?.name}`}>
                      {recipe.mealType?.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 max-lg:hidden">
                    <Link prefetch="intent" to={`?cuisine=${recipe.cuisine?.name}`}>
                      {recipe.cuisine?.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 max-lg:hidden">
                    <Link prefetch="intent" to={`?member=${recipe.user.firstName}`}>
                      {recipe.user.firstName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 text-right max-lg:hidden">
                    {formatDistanceToNowStrict(new Date(recipe.updatedAt))} ago
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center border border-dashed px-6 py-24 text-center">
          <div className="flex items-center justify-center text-3xl">📖</div>
          <h2 className="mt-4 text-lg">No recipes to show</h2>
          <p className="mt-2 text-gray-500">Add a new recipe and it will show up here</p>
        </div>
      )}
      {data.recipes.length ? (
        <Pagination totalCount={data.filteredCount} currentPage={currentPage} />
      ) : null}
    </div>
  )
}
