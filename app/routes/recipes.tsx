import { Link } from '@remix-run/react'

export default function Recipes() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6 sm:p-12">
      <header className="flex w-full items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <span>Familjen Wallström</span>
          <span>/</span>
          <span>Recipes</span>
        </div>
        <div>+ New recipe</div>
      </header>

      {/* Search and filter */}
      <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 sm:mt-12">
        <input
          placeholder="Search recipes..."
          type="text"
          className="w-full border border-gray-300 px-3 py-1.5 outline-none focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-950"
        />
        <div className="flex w-full flex-wrap justify-between gap-4">
          <select
            name="mealType"
            id="mealType"
            className="flex-1 appearance-none border border-gray-300 py-1.5 pl-3 pr-10 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="1">Filter by meal type</option>
          </select>
          <select
            name="mealType"
            id="mealType"
            className="flex-1 appearance-none border border-gray-300 py-1.5 pl-3 pr-10 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="1">Filter by cuisine</option>
          </select>
          <select
            name="mealType"
            id="mealType"
            className="flex-1 appearance-none border border-gray-300 py-1.5 pl-3 pr-10 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="1">Filter by member</option>
          </select>
        </div>
      </div>

      {/* Recipe list */}
      <ul className="mt-6 divide-y border-y sm:mt-12">
        {recipes.map((recipe) => (
          <li className="group relative py-4" key={recipe.id}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">
                <Link to="/recipes/id">
                  <span className="absolute -inset-x-5 -inset-y-px bottom-0"></span>
                  {recipe.title}
                </Link>
              </h2>
              <div>→</div>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div>
                  <Link
                    to="/recipes"
                    className="relative text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    {recipe.mealType}
                  </Link>
                </div>
                <span className="text-gray-500">•</span>
                <div>
                  <Link
                    to="/recipes"
                    className="relative text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    {recipe.cuisine}
                  </Link>
                </div>
                <span className="text-gray-500">•</span>
                <div>
                  <Link
                    to="/recipes"
                    className="relative text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    {recipe.member}
                  </Link>
                </div>
              </div>
              <div className="text-gray-600">Updated 2 hours ago</div>
            </div>
            <span className="absolute -inset-x-4 -inset-y-px -z-10 group-hover:border group-hover:bg-gray-100 dark:group-hover:bg-gray-900"></span>
          </li>
        ))}
      </ul>
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
