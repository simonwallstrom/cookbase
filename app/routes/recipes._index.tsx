import { Link } from '@remix-run/react'

export default function Recipes() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 sm:p-12">
      <header className="flex w-full items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <Link to="/recipes" className="underline-offset-4 hover:underline">
            Familjen Wallström
          </Link>
          <span>/</span>
          <span className="text-gray-500">Recipes</span>
        </div>
        <button className="underline-offset-4 hover:underline">+ New recipe</button>
      </header>

      {/* Search and filter */}
      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-12 gap-y-4 sm:mt-12">
        <input
          placeholder="Search recipes..."
          type="text"
          className="flex-grow border border-gray-950 px-3 py-1.5 outline-none outline-offset-0 focus-visible:border-yellow-500 focus-visible:outline-1 focus-visible:outline-yellow-500 dark:border-gray-700 dark:bg-gray-950"
        />
        <div className="flex flex-grow flex-wrap justify-between gap-4">
          <select
            name="mealType"
            id="mealType"
            className="flex-1 appearance-none border border-gray-950 py-1.5 pl-3 pr-10 outline-none outline-offset-0 focus-visible:border-yellow-500 focus-visible:outline-1 focus-visible:outline-yellow-500 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="1">Filter by meal type</option>
          </select>
          <select
            name="mealType"
            id="mealType"
            className="flex-1 appearance-none border border-gray-950 py-1.5 pl-3 pr-10 outline-none outline-offset-0 focus-visible:border-yellow-500 focus-visible:outline-1 focus-visible:outline-yellow-500 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="1">Filter by cuisine</option>
          </select>
          <select
            name="mealType"
            id="mealType"
            className="flex-1 appearance-none border border-gray-950 py-1.5 pl-3 pr-10 outline-none outline-offset-0 focus-visible:border-yellow-500 focus-visible:outline-1 focus-visible:outline-yellow-500 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="1">Filter by member</option>
          </select>
        </div>
      </div>

      {/* Recipe list */}
      <div className="mt-2 overflow-x-scroll sm:mt-8">
        <table className="min-w-full divide-y border-b">
          <thead>
            <tr>
              <th className="whitespace-nowrap py-4 pr-3 text-left font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <span>Title</span>
                </div>
              </th>
              <th className="whitespace-nowrap px-3 py-4 text-left font-medium text-gray-500 max-md:hidden">
                Meal type
              </th>
              <th className="whitespace-nowrap px-3 py-4 text-left font-medium text-gray-500 max-md:hidden">
                Cuisine
              </th>
              <th className="whitespace-nowrap px-3 py-4 text-left font-medium text-gray-500 max-md:hidden">
                Created by
              </th>
              <th className="whitespace-nowrap py-4 pl-3 text-right font-medium text-gray-500 max-md:hidden">
                Last updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recipes.map((recipe) => (
              <tr className="group" key={recipe.id}>
                <td className="py-4 pr-3">
                  <div className="line-clamp-1 md:min-w-80">
                    <Link
                      to={`/recipes/id`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {recipe.title}
                    </Link>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 max-md:hidden">
                  <Link
                    className="underline-offset-4 hover:underline"
                    to={`?mealType=${recipe.mealType}`}
                  >
                    {recipe.mealType}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 max-md:hidden">
                  <Link
                    className="underline-offset-4 hover:underline"
                    to={`?cuisine=${recipe.cuisine}`}
                  >
                    {recipe.cuisine}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 max-md:hidden">
                  <Link className="underline-offset-4 hover:underline" to={`?member=`}>
                    {recipe.member}
                  </Link>
                </td>
                <td className="whitespace-nowrap py-4 pl-3 text-right max-md:hidden">
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
    title: 'Lasagne med soltorkade tomater',
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
