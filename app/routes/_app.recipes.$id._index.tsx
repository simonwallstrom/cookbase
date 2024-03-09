import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
  Link as RemixLink,
  useFetcher,
  useLocation,
  useSubmit,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { type ElementRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Link } from '~/components/link'
import { Textarea } from '~/components/textarea'
import { requireAuth } from '~/lib/auth.server'
import { prisma } from '~/lib/prisma.server'
import { deleteNote, getNotes, updateNoteStatus } from '~/models/note.server'
import { getRecipe, toggleShareRecipe } from '~/models/recipe.server'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/dialog'
import { Switch } from '~/components/switch'
import { Input } from '~/components/input'
import { Label } from '~/components/label'

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

  const host = new URL(request.url).host
  const shareLink = `${host}/public/${recipe.id}`

  return json({ currentUserId: userId, recipe, notes, shareLink })
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
  z.object({
    _action: z.enum(['SHARE_RECIPE']),
    recipeId: z.string().cuid(),
    isPublic: z.coerce.boolean(),
  }),
])

export async function action({ request, params }: ActionFunctionArgs) {
  const { orgId, userId } = await requireAuth(request)
  const formData = await request.formData()

  const result = schema.safeParse({ ...Object.fromEntries(formData), recipeId: params.id })

  if (!result.success) {
    return json(
      {
        errors: result.error.flatten(),
        message: '',
        _action: '',
      },
      { status: 400 },
    )
  }

  if (result.data._action === 'ADD_NOTE') {
    await prisma.note.create({
      data: {
        recipeId: result.data.recipeId,
        message: result.data.message,
        userId,
        organizationId: orgId,
        activity: {
          create: {
            type: 'NOTE',
            recipeId: result.data.recipeId,
            organizationId: orgId,
            userId,
          },
        },
      },
    })

    return json(
      { errors: null, message: 'Note added', _action: 'ADD_NOTE' },
      {
        status: 200,
      },
    )
  }

  if (result.data._action === 'DELETE_NOTE') {
    await deleteNote({ id: result.data.noteId, organizationId: orgId, userId })
    return json(
      { errors: null, message: 'Note deleted', _action: 'DELETE_NOTE' as const },
      {
        status: 200,
      },
    )
  }

  if (result.data._action === 'RESOLVE_NOTE') {
    await updateNoteStatus({
      id: result.data.noteId,
      organizationId: orgId,
      userId,
      isResolved: true,
    })
    return json(
      { errors: null, message: 'Note resolved', _action: 'RESOLVE_NOTE' },
      {
        status: 200,
      },
    )
  }

  if (result.data._action === 'UNRESOLVE_NOTE') {
    await updateNoteStatus({
      id: result.data.noteId,
      organizationId: orgId,
      userId,
      isResolved: false,
    })
    return json(
      { errors: null, message: 'Note unresolved', _action: 'UNRESOLVE_NOTE' },
      { status: 200 },
    )
  }

  if (result.data._action === 'SHARE_RECIPE') {
    await toggleShareRecipe(orgId, result.data.recipeId, result.data.isPublic)
    return json(
      { errors: null, message: 'Recipe updated', _action: 'SHARE_RECIPE' },
      { status: 200 },
    )
  }
}

export default function RecipeId() {
  const { recipe, shareLink } = useLoaderData<typeof loader>()
  const ingredients = recipe.ingredients?.split(/\r?\n/).filter((item) => item.length)
  const instructions = recipe.instructions?.split(/\r?\n/).filter((item) => item.length)
  const [open, setIsOpen] = useState(false)

  const submit = useSubmit()
  const navigation = useNavigation()
  const [copyInviteLink, setCopyInviteLink] = useState(false)

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(shareLink).then(function () {
      setCopyInviteLink(true)
      setTimeout(() => {
        setCopyInviteLink(false)
      }, 2500)
    })
  }

  return (
    <>
      {/* Share dialog */}
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share recipe</DialogTitle>
            <DialogDescription>
              Share this recipe with anyone by enabling a public link.
            </DialogDescription>
          </DialogHeader>

          <Form
            onChange={(event) => {
              submit(event.currentTarget)
            }}
            action={`/recipes/${recipe.id}`}
            method="post"
          >
            <input type="hidden" name="recipeId" value={recipe.id} />
            <input type="hidden" name="_action" value="SHARE_RECIPE" />
            <Label
              className="mt-4 flex w-full items-center justify-between font-medium"
              htmlFor="isPublic"
            >
              <span>Enable public link</span>
              <Switch name="isPublic" defaultChecked={recipe.isPublic} />
            </Label>
          </Form>

          {recipe.isPublic || navigation.formData?.get('isPublic') === 'on' ? (
            <div className="mt-4 grid gap-4">
              <Input
                disabled={
                  navigation.state !== 'idle' &&
                  navigation.formData?.get('_action') === 'SHARE_RECIPE'
                }
                readOnly
                value={shareLink}
              />
              <Button
                disabled={
                  navigation.state !== 'idle' &&
                  navigation.formData?.get('_action') === 'SHARE_RECIPE'
                }
                onClick={handleCopyInviteLink}
              >
                {copyInviteLink ? <span>Copied!</span> : <span>Copy&nbsp;link</span>}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Page header */}
      <header className="flex w-full items-center justify-between gap-6 font-medium">
        <div className="flex min-w-0 items-center gap-2">
          <Link prefetch="intent" to="/recipes">
            Recipes
          </Link>
          <span>/</span>
          <span className="truncate text-gray-500">{recipe.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex gap-2">
              <span>Options</span>
              <span>▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setIsOpen(true)}>Share</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <RemixLink to="edit">Edit</RemixLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <RemixLink to="delete">Delete</RemixLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <Notes />
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

function Notes() {
  const { currentUserId, notes } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = new URLSearchParams()
  const navigation = useNavigation()
  const isAddingNote =
    navigation.state === 'submitting' && navigation.formData?.get('_action') === 'ADD_NOTE'

  const addNoteFormRef = useRef<ElementRef<'form'>>(null)
  const addNoteMessageRef = useRef<ElementRef<'textarea'>>(null)

  useEffect(() => {
    if (actionData?._action === 'ADD_NOTE') {
      toast.success(actionData?.message)
      addNoteFormRef.current?.reset()
      addNoteMessageRef.current?.focus()
    }
  }, [actionData])

  return (
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

        {/* List of notes */}
        <div className="mt-6 divide-y divide-dashed border-y border-dashed">
          {notes.map((note) => (
            <Note currentUserId={currentUserId} key={note.id} note={note} />
          ))}
        </div>

        {/* Add notes */}
        <Form
          ref={addNoteFormRef}
          replace
          method="post"
          className="mt-6 flex max-w-2xl flex-col gap-6"
        >
          <input type="hidden" name="_action" value="ADD_NOTE" />
          <div className="grid gap-1.5">
            <label className="sr-only font-medium" htmlFor="message">
              Message
            </label>
            <Textarea
              ref={addNoteMessageRef}
              placeholder="Add a new note..."
              disabled={isAddingNote}
              id="message"
              rows={4}
              name="message"
            />
            {actionData?.errors?.fieldErrors.message ? (
              <div className="text-sm text-red-600">{actionData?.errors?.fieldErrors.message}</div>
            ) : null}
          </div>
          <div>
            <Button disabled={isAddingNote}>Add note</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

function Note({
  note,
  currentUserId,
}: {
  note: SerializeFrom<typeof loader>['notes'][number]
  currentUserId: string
}) {
  const fetcher = useFetcher<typeof action>()
  const location = useLocation()
  const [lastAction, setLastAction] = useState('')
  const [highlightNote, setHighlightNote] = useState(false)

  useEffect(() => {
    setHighlightNote(location.hash.includes(note.id))
  }, [location, note])

  useEffect(() => {
    const action = fetcher.data?._action
    const message = fetcher.data?.message

    // Check if there's an action and it's different from the last one
    if (action && action !== lastAction) {
      toast.success(message)
      setLastAction(action) // Update the last action
    }
  }, [fetcher, lastAction]) // Depend on `lastAction` too

  return (
    <div id={note.id} className="relative scroll-mt-20 py-4">
      <div
        className={`absolute -inset-x-6 inset-y-0 -m-px border bg-gray-800/40 opacity-0 transition-opacity delay-300 ${highlightNote ? 'opacity-100' : ''}`}
      />

      <div className="relative max-w-2xl">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <div>{note.user.firstName}</div>
          <div className="font-serif font-bold">·</div>
          <div>{formatDistanceToNow(new Date(note.createdAt))} ago</div>
        </div>
        <div className={`mt-1 ${note.isResolved ? 'line-through' : ''}`}>{note.message}</div>
        <div className="mt-1 flex items-center gap-4">
          <fetcher.Form method="post">
            {note.isResolved ? (
              <input type="hidden" name="_action" value="UNRESOLVE_NOTE" />
            ) : (
              <input type="hidden" name="_action" value="RESOLVE_NOTE" />
            )}
            <Button
              className="text-sm font-medium text-gray-500 hover:text-inherit"
              variant="link"
              name="noteId"
              disabled={fetcher.state !== 'idle' && fetcher.formData?.get('noteId') === note.id}
              value={note.id}
            >
              {note.isResolved ? <span>Unresolve</span> : <span>Resolve</span>}
            </Button>
          </fetcher.Form>
          {note.user.id === currentUserId ? (
            <fetcher.Form method="post">
              <input type="hidden" name="_action" value="DELETE_NOTE" />
              <Button
                className="text-sm font-medium text-gray-500 hover:text-inherit"
                variant="link"
                name="noteId"
                disabled={fetcher.state !== 'idle' && fetcher.formData?.get('noteId') === note.id}
                value={note.id}
              >
                Delete
              </Button>
            </fetcher.Form>
          ) : null}
        </div>
      </div>
    </div>
  )
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
