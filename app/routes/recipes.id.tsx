import { Link } from '~/components/link'
import { DividerHeading } from '~/components/divider-heading'

export default function Recipes() {
  return (
    <div className="mx-auto mb-64 w-full max-w-7xl p-6 sm:p-12">
      <header className="flex w-full items-center justify-between gap-6 font-medium">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/recipes">Recipes</Link>
          <span>/</span>
          <span className="truncate text-gray-500">Lax med potatis och romsås</span>
        </div>
        <button className="underline-offset-4 hover:underline">Edit</button>
      </header>

      <div className="mt-6 border-t pt-12 sm:mt-12 sm:pt-20">
        <div className="text-gray-500">Created 3 weeks ago</div>

        <h1 className="mt-3 text-balance text-3xl font-bold sm:mt-5 sm:text-4xl md:text-5xl">
          {recipe.title}
        </h1>

        <div className="mt-4 flex flex-col gap-x-8 gap-y-2 sm:mt-7 sm:flex-row">
          <div className="flex gap-2">
            <div className="text-gray-500 max-sm:w-24">Meal type</div>
            <Link to="/recipes">{recipe.mealType}</Link>
          </div>
          <div className="flex gap-2">
            <div className="text-gray-500 max-sm:w-24">Cuisine</div>
            <Link to="/recipes">{recipe.cuisine}</Link>
          </div>
          <div className="flex gap-2">
            <div className="text-gray-500 max-sm:w-24">Member</div>
            <Link to="/recipes">{recipe.member}</Link>
          </div>
        </div>
      </div>

      <div className="mt-12 grid items-start gap-12 sm:mt-20 lg:grid-cols-3 xl:gap-24">
        <div className="sticky top-12">
          <DividerHeading as="h2">Ingredients</DividerHeading>
          <ul className="list-inside list-disc">
            <li className="mt-6 list-none py-2 font-semibold">Till köttet</li>
            <li className="py-2">500g högrev</li>
            <li className="py-2">2 lökar</li>
            <li className="py-2">Senap</li>
            <li className="py-2">Ketchup</li>
            <li className="mt-4 list-none py-2 font-semibold">Tillbehör:</li>
            <li className="py-2">500g högrev</li>
            <li className="py-2">2 lökar</li>
            <li className="py-2">Senap</li>
            <li className="py-2">Ketchup</li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <DividerHeading as="h2">Instructions</DividerHeading>
          <ol className="[counter-reset:ingredients-list]">
            <li className="mt-8 font-semibold">Till köttet</li>
            <li className="my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-mono before:font-bold before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde voluptas expedita quasi
              odio fugiat explicabo animi beatae aliquam. Saepe, voluptates ipsa provident quam sed
              maxime aliquam dignissimos excepturi eveniet omnis.
            </li>
            <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-mono before:font-bold before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde voluptas expedita quasi
              odio fugiat explicabo animi beatae aliquam. Saepe, voluptates ipsa provident quam sed
              maxime aliquam dignissimos excepturi eveniet omnis.
            </li>
            <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-mono before:font-bold before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde voluptas expedita quasi
              odio fugiat explicabo animi beatae aliquam. Saepe, voluptates ipsa provident quam sed
              maxime aliquam dignissimos excepturi eveniet omnis.
            </li>

            <li className="mt-8 font-semibold">Till brödet</li>
            <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-mono before:font-bold before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde voluptas expedita quasi
              odio fugiat explicabo animi beatae aliquam. Saepe, voluptates ipsa provident quam sed
              maxime aliquam dignissimos excepturi eveniet omnis.
            </li>
            <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-mono before:font-bold before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde voluptas expedita quasi
              odio fugiat explicabo animi beatae aliquam. Saepe, voluptates ipsa provident quam sed
              maxime aliquam dignissimos excepturi eveniet omnis.
            </li>
            <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-mono before:font-bold before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde voluptas expedita quasi
              odio fugiat explicabo animi beatae aliquam. Saepe, voluptates ipsa provident quam sed
              maxime aliquam dignissimos excepturi eveniet omnis.
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
const recipe = {
  id: 1,
  title: 'Lax med potatis och romsås',
  member: 'Simon',
  mealType: 'Main course',
  cuisine: 'American',
}
