import { json, type LoaderFunctionArgs } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
  NavLink as RemixNavLink,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { Link } from '~/components/link'
import { getUserId } from '~/lib/auth.server'
import { getPublicRecipe } from '~/models/recipe.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  const recipeId = z.string().cuid().safeParse(params.id)

  if (!recipeId.success) {
    throw new Response('Recipe not found', { status: 404, statusText: 'Not found' })
  }

  const recipe = await getPublicRecipe({ id: recipeId.data })

  if (!recipe) {
    throw new Response('Recipe not found', { status: 404 })
  }

  return json({ recipe, userId })
}

export default function RecipeId() {
  const { recipe } = useLoaderData<typeof loader>()
  const ingredients = recipe.ingredients?.split(/\r?\n/).filter((item) => item.length)
  const instructions = recipe.instructions?.split(/\r?\n/).filter((item) => item.length)

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-6 pb-64 pt-6 standalone:mt-12 sm:px-12 sm:pt-12">
        {/* Title and meta */}
        <div className="mt-6 border-b pb-12 sm:mt-12 sm:pb-16 xl:pb-24">
          <div className="text-gray-500">
            <span>Created</span> <span>{formatDistanceToNow(new Date(recipe.createdAt))} ago</span>
          </div>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl">
            {recipe.title}
          </h1>
          <div className="mt-5 flex flex-col flex-wrap gap-x-8 gap-y-2 sm:mt-7 md:flex-row">
            <div>
              <span className="text-gray-500">By</span> <span>{recipe.organization.name}</span>
            </div>
          </div>
        </div>

        {/* Ingredients and instructions */}
        <div className="mt-12 flex flex-col items-start gap-12 md:flex-row xl:gap-24">
          <div className="w-full md:w-64 lg:w-80">
            {/* Ingredients */}
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">Ingredients</h2>
              {recipe.servings ? (
                <span className="text-gray-500">
                  {recipe.servings} {recipe.servings > 1 ? 'servings' : 'serving'}
                </span>
              ) : null}
            </div>
            <ul className="mt-4 list-inside divide-y divide-dashed border-y border-dashed">
              {ingredients.map((ingredient, index) => (
                <IngredientItem key={index} val={ingredient} />
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Instructions</h2>
            <ol className="[counter-reset:ingredients-list]">
              {instructions.map((instruction, index) => (
                <InstructionItem key={index} val={instruction} />
              ))}
            </ol>
          </div>
        </div>
      </main>
    </>
  )
}

const IngredientItem = ({ val }: { val: string }) => {
  if (val.endsWith(':') || val.trimEnd().endsWith(':')) {
    return <li className="py-2 font-semibold">{val}</li>
  } else {
    return <li className="text-gray-1100 py-2">{val}</li>
  }
}

const InstructionItem = ({ val }: { val: string }) => {
  if (val.endsWith(':') || val.trimEnd().endsWith(':')) {
    return <li className="mt-6 font-medium">{val}</li>
  } else {
    return (
      <li className="text-gray-1100 my-4 flex leading-relaxed [counter-increment:ingredients-list] before:mr-6 before:font-medium before:text-gray-500 before:content-[counter(ingredients-list,_decimal-leading-zero)]">
        {val}
      </li>
    )
  }
}

function Header() {
  const { userId } = useLoaderData<typeof loader>()
  return (
    <header className="sticky top-0 bg-white ring-1 ring-gray-950 ring-opacity-10 dark:bg-gray-950 dark:ring-white dark:ring-opacity-[.085]">
      <div className="mx-auto flex w-full max-w-7xl items-center px-6 sm:px-12">
        <NavLink to="/">Cookbase</NavLink>
        <div className="ml-auto flex gap-6 sm:gap-12">
          {userId ? (
            <NavLink to="/home">Back to app</NavLink>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/request-access">Request access</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const navigation = useNavigation()

  return (
    <RemixNavLink
      prefetch="intent"
      draggable="false"
      className={({ isActive }) =>
        'group touch-none select-none py-5 font-medium outline-none ' +
        (isActive ? '' : 'text-gray-500 hover:text-inherit')
      }
      to={to}
    >
      <span
        className={`inline-flex ${navigation.state === 'loading' && navigation.location.pathname.includes(to) ? 'text-gray-950 dark:text-gray-300' : ''} ${navigation.state === 'loading' && navigation.location.pathname !== to ? 'text-gray-500' : ''} group-focus-visible:bg-yellow-300 group-focus-visible:text-gray-950`}
      >
        {children}
      </span>
    </RemixNavLink>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="flex gap-4 text-balance text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl">
          <span className="text-gray-500">{error.status}</span>
          <span>{error.data}</span>
        </h1>
        <div className="mt-7">
          <Link to="/">← Back to startpage</Link>
        </div>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
