import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/react'
import { Link } from '~/components/link'
import { Input } from '~/components/input'
import { Select } from '~/components/select'
import { requireAuth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuth(request)
  if (!userId) return redirect('/login')
  return null
}

export default function Recipes() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 sm:p-12">
      <header className="flex w-full items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <Link to="/settings">Familjen Wallström</Link>
          <span>/</span>
          <span className="text-gray-500">Recipes</span>
        </div>
        <Link to="/recipes">+ New</Link>
      </header>

      {/* Search and filter */}
      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-12 gap-y-4 sm:mt-12">
        <Input placeholder="Search recipes..." className="flex-grow" />
        <div className="flex flex-grow flex-wrap justify-between gap-4">
          <Select className="flex-grow">
            <option value="1">Filter by meal type</option>
          </Select>
          <Select className="flex-grow">
            <option value="1">Filter by cuisine</option>
          </Select>
          <Select className="flex-grow">
            <option value="1">Filter by member</option>
          </Select>
        </div>
      </div>

      {/* Recipe list */}
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
            {recipes.map((recipe) => (
              <tr className="group" key={recipe.id}>
                <td className="py-3 lg:py-4 lg:pr-3">
                  <div className="lg:min-w-80">
                    <Link
                      prefetch="intent"
                      title={recipe.title}
                      to={`/recipes/id`}
                      className="min-w-0 font-medium underline-offset-4 hover:underline max-lg:block"
                    >
                      <span className="lg:line-clamp-1">{recipe.title}</span>
                    </Link>
                  </div>
                  {/* <div className="mt-1 flex gap-x-2 text-sm text-gray-500 lg:hidden">
                    <div className="flex gap-2">
                      <Link to="/recipes">{recipe.mealType}</Link>
                    </div>
                    <div>·</div>
                    <div className="flex gap-2">
                      <Link to="/recipes">{recipe.cuisine}</Link>
                    </div>
                    <div>·</div>
                    <div className="flex gap-2">
                      <Link to="/recipes">{recipe.member}</Link>
                    </div>
                  </div> */}
                </td>
                <td className="whitespace-nowrap px-3 py-4 max-lg:hidden">
                  <Link
                    className="underline-offset-4 hover:underline"
                    to={`?mealType=${recipe.mealType}`}
                  >
                    {recipe.mealType}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 max-lg:hidden">
                  <Link
                    className="underline-offset-4 hover:underline"
                    to={`?cuisine=${recipe.cuisine}`}
                  >
                    {recipe.cuisine}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 max-lg:hidden">
                  <Link className="underline-offset-4 hover:underline" to={`?member=`}>
                    {recipe.member}
                  </Link>
                </td>
                <td className="whitespace-nowrap py-4 pl-3 text-right max-lg:hidden">
                  2 weeks ago
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const recipes = [
  {
    id: 1,
    title: 'Smash burger',
    member: 'Simon',
    mealType: 'Main course',
    cuisine: 'American',
  },
  {
    id: 2,
    title: 'Lasagne med soltorkade tomater och egentillverkad getost med franska inslag',
    member: 'Lisa',
    mealType: 'Weeknight dinner',
    cuisine: 'Italian',
  },
  {
    id: 3,
    title: 'American pancakes med lönnsirap',
    member: 'Simon',
    mealType: 'Breakfast',
    cuisine: 'American',
  },
  {
    id: 4,
    title: 'Lax med potatis och romsås',
    member: 'Viggo',
    mealType: 'Weeknight dinner',
    cuisine: 'Nordic',
  },
]
