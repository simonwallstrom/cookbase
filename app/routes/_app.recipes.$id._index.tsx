import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Link } from '~/components/link'
import { Textarea } from '~/components/textarea'
import { requireAuth } from '~/lib/auth.server'
import { prisma } from '~/lib/prisma.server'
import { deleteNote, getNotes, updateNoteStatus } from '~/models/note.server'
import { getRecipe } from '~/models/recipe.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId, orgId } = await requireAuth(request)
  const recipeId = z.string().cuid().safeParse(params.id)

  if (!recipeId.success) {
    throw new Response('Recipe not found', { status: 404, statusText: 'Not found' })
  }

  const recipe = await getRecipe({ organizationId: orgId, id: recipeId.data })

  if (!recipe) {
    throw new Response('Recipe not found', { status: 404 })
  }

  const url = new URL(request.url)
  const showResolvedNotes = url.searchParams.get('notes')?.includes('resolved')

  const notes = await getNotes({
    organizationId: orgId,
    recipeId: recipeId.data,
    showResolvedNotes,
  })

  return json({ currentUserId: userId, recipe, notes })
}

const schema = z.discriminatedUnion('_action', [
  z.object({
    _action: z.enum(['ADD_NOTE']),
    message: z.string().min(1, 'Title is required'),
    recipeId: z.string().cuid(),
  }),
  z.object({ _action: z.enum(['DELETE_NOTE']), noteId: z.string().cuid() }),
  z.object({ _action: z.enum(['RESOLVE_NOTE']), noteId: z.string().cuid() }),
  z.object({ _action: z.enum(['UNRESOLVE_NOTE']), noteId: z.string().cuid() }),
])

export async function action({ request, params }: ActionFunctionArgs) {
  const { orgId, userId } = await requireAuth(request)
  const formData = await request.formData()

  const result = schema.safeParse({ ...Object.fromEntries(formData), recipeId: params.id })

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  if (result.data._action === 'ADD_NOTE') {
    await prisma.note.create({
      data: {
        recipeId: result.data.recipeId,
        message: result.data.message,
        userId,
        organizationId: orgId,
      },
    })

    return json({ errors: null }, { status: 200 })
  }

  if (result.data._action === 'DELETE_NOTE') {
    await deleteNote({ id: result.data.noteId, organizationId: orgId, userId })
    return json({ errors: null }, { status: 200 })
  }

  if (result.data._action === 'RESOLVE_NOTE') {
    await updateNoteStatus({
      id: result.data.noteId,
      organizationId: orgId,
      userId,
      isResolved: true,
    })
    return json({ errors: null }, { status: 200 })
  }

  if (result.data._action === 'UNRESOLVE_NOTE') {
    await updateNoteStatus({
      id: result.data.noteId,
      organizationId: orgId,
      userId,
      isResolved: false,
    })
    return json({ errors: null }, { status: 200 })
  }
}

export default function RecipeId() {
  const { currentUserId, recipe, notes } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const ingredients = recipe.ingredients?.split(/\r?\n/).filter((item) => item.length)
  const instructions = recipe.instructions?.split(/\r?\n/).filter((item) => item.length)

  const [searchParams, setSearchParams] = useSearchParams()
  const params = new URLSearchParams()

  return (
    <>
      {/* Page header */}
      <header className="flex w-full items-center justify-between gap-6 font-medium">
        <div className="flex min-w-0 items-center gap-2">
          <Link prefetch="intent" to="/recipes">
            Recipes
          </Link>
          <span>/</span>
          <span className="truncate text-gray-500">{recipe.title}</span>
        </div>
        <Link variant="button" to="edit">
          Edit
        </Link>
      </header>

      {/* Title and meta */}
      <div className="mt-6 border-y py-12 sm:mt-12 sm:py-16 xl:py-24">
        <div className="text-gray-500">
          <span>Created</span> <span>{formatDistanceToNow(new Date(recipe.createdAt))} ago</span>
        </div>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl">
          {recipe.title}
        </h1>
        <div className="mt-5 flex flex-col flex-wrap gap-x-8 gap-y-2 sm:mt-7 md:flex-row">
          {recipe.mealType?.name.length ? (
            <div className="flex gap-3">
              <span className="text-gray-500 max-md:w-24">Meal type</span>{' '}
              <Link prefetch="intent" to={`/recipes/?mealType=${recipe.mealType?.name}`}>
                {recipe.mealType?.name}
              </Link>
            </div>
          ) : null}
          {recipe.mealType?.name.length ? (
            <div className="flex gap-3">
              <span className="text-gray-500 max-md:w-24">Cuisine</span>{' '}
              <Link prefetch="intent" to={`/recipes/?cuisine=${recipe.cuisine?.name}`}>
                {recipe.cuisine?.name}
              </Link>
            </div>
          ) : null}
          <div className="flex gap-3">
            <span className="text-gray-500 max-md:w-24">Member</span>{' '}
            <Link prefetch="intent" to={`/recipes/?member=${recipe.user.firstName}`}>
              {recipe.user.firstName}
            </Link>
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

      {/* Notes */}
      <div id="notes" className="mt-12 sm:mt-24">
        <div className="bg-gray-100 p-6 sm:p-12 dark:border dark:bg-gray-900">
          {/* Notes header */}
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <h2 className="text-2xl font-semibold">Notes ({notes.length})</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Ideas and suggestions on how to improve this recipe.
              </p>
            </div>
            {searchParams.get('notes')?.includes('resolved') ? (
              <Button
                className="text-gray-500 hover:text-inherit"
                variant="link"
                onClick={() => {
                  params.delete('notes')
                  setSearchParams(params, {
                    preventScrollReset: true,
                    replace: true,
                  })
                }}
              >
                Hide resolved notes
              </Button>
            ) : (
              <Button
                className="text-gray-500 hover:text-inherit"
                variant="link"
                onClick={() => {
                  params.set('notes', 'resolved')
                  setSearchParams(params, {
                    preventScrollReset: true,
                    replace: true,
                  })
                }}
              >
                Show resolved notes
              </Button>
            )}
          </div>

          <div className="mt-6 divide-y divide-dashed border-y border-dashed">
            {notes.map((note) => (
              <div id={note.id} key={note.id} className="py-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <div>{note.user.firstName}</div>
                    <div className="font-serif font-bold">·</div>
                    <div>{formatDistanceToNow(new Date(note.createdAt))} ago</div>
                  </div>
                  <div className={`mt-1 ${note.isResolved ? 'line-through' : ''}`}>
                    {note.message}
                  </div>
                  <div className="mt-1 flex items-center gap-4">
                    <Form method="post">
                      {note.isResolved ? (
                        <input type="hidden" name="_action" value="UNRESOLVE_NOTE" />
                      ) : (
                        <input type="hidden" name="_action" value="RESOLVE_NOTE" />
                      )}
                      <Button
                        className="text-sm font-medium text-gray-500 hover:text-inherit"
                        variant="link"
                        name="noteId"
                        value={note.id}
                      >
                        {note.isResolved ? <span>Unresolve</span> : <span>Resolve</span>}
                      </Button>
                    </Form>
                    {note.user.id === currentUserId ? (
                      <Form method="post">
                        <input type="hidden" name="_action" value="DELETE_NOTE" />
                        <Button
                          className="text-sm font-medium text-gray-500 hover:text-inherit"
                          variant="link"
                          name="noteId"
                          value={note.id}
                        >
                          Delete
                        </Button>
                      </Form>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Form method="post" className="mt-6 flex max-w-2xl flex-col gap-6">
            <input type="hidden" name="_action" value="ADD_NOTE" />
            <div className="grid gap-1.5">
              <label className="sr-only font-medium" htmlFor="message">
                Message
              </label>
              <Textarea placeholder="Add a new note..." id="message" rows={4} name="message" />
              {actionData?.errors?.fieldErrors.message ? (
                <div className="text-sm text-red-600">
                  {actionData?.errors?.fieldErrors.message}
                </div>
              ) : null}
            </div>
            <div>
              <Button>Add note</Button>
            </div>
          </Form>
        </div>
      </div>
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

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1 className="flex gap-4 text-balance text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl">
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
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
