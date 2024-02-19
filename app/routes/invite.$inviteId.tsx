import { type LoaderFunctionArgs, json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { createUserSession, getUserId } from '~/lib/auth.server'
import { getInviteById } from '~/models/invitation.server'
import { createInvitedUser, getUserByEmail } from '~/models/user.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const inviteId = z.string().cuid().safeParse(params.inviteId)

  if (!inviteId.success) {
    throw new Response('Invite link not found...', { status: 404, statusText: 'Not found' })
  }

  const userId = await getUserId(request)
  if (userId) return redirect('/home')

  const invite = await getInviteById(inviteId.data)

  if (!invite) {
    throw new Response('Invite link not found...', {
      status: 404,
      statusText: 'Not found',
    })
  }

  return json({ invite })
}

const schema = z.object({
  organizationId: z.string().cuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .refine(
      async (email) => {
        const existingUser = await getUserByEmail(email)
        if (!existingUser) {
          return z.NEVER
        }
      },
      { message: 'A user already exists with this email' },
    ),
  password: z.string().min(6, 'Password must be atleast 6 characters long'),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const result = await schema.safeParseAsync(Object.fromEntries(formData))

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  const user = await createInvitedUser(result.data)

  return createUserSession({
    request,
    userId: user.id,
    orgId: user.organizationId,
    redirectTo: '/home?new-member',
  })
}

export default function Signup() {
  const { invite } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="mx-auto w-full max-w-xs text-center">
        <h1 className="text-5xl font-semibold tracking-tight">You are invited!</h1>
        <p className="mt-3 text-balance text-gray-500">
          You are invited to join {invite.organization.name} on Cookbase.
        </p>
        <Form method="post" className="mt-8 flex flex-col gap-5">
          <input
            id="organizationId"
            name="organizationId"
            type="hidden"
            defaultValue={invite.organization.id}
            className="w-full text-sm"
          />
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="sr-only" htmlFor="firstName">
                First name
              </label>
              <Input
                type="text"
                required
                name="firstName"
                id="firstName"
                placeholder="First name..."
              />
              {actionData?.errors?.fieldErrors.firstName ? (
                <div className="text-red text-sm">{actionData?.errors?.fieldErrors.firstName}</div>
              ) : null}
            </div>
            <div className="flex flex-col">
              <label className="sr-only" htmlFor="lastName">
                Last name
              </label>
              <Input
                type="text"
                required
                name="lastName"
                id="lastName"
                placeholder="Last name..."
              />
              {actionData?.errors?.fieldErrors.lastName ? (
                <div className="text-red text-sm">{actionData?.errors?.fieldErrors.lastName}</div>
              ) : null}
            </div>
          </div>
          <div className="grid">
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <Input type="email" required name="email" id="email" placeholder="Email address..." />
            {actionData?.errors?.fieldErrors.email ? (
              <div className="text-red text-sm">{actionData?.errors?.fieldErrors.email}</div>
            ) : null}
          </div>
          <div className="grid">
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <Input
              name="password"
              required
              id="password"
              type="password"
              placeholder="Password..."
            />
            {actionData?.errors?.fieldErrors.password ? (
              <div className="text-red text-sm">{actionData?.errors?.fieldErrors.password}</div>
            ) : null}
          </div>
          <div>
            <Button className="w-full">Create account</Button>
          </div>
        </Form>
        <div className="mt-8 text-sm text-gray-500">
          <span>Already have an account?</span> <Link to="/login">Login instead</Link>
        </div>
      </div>
      <div className="absolute left-6 top-4 lg:left-8 lg:top-6">
        <Link className="text-sm font-medium text-gray-500" to="/">
          ← Home
        </Link>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-5xl font-semibold tracking-tight text-red-500 dark:text-red-400">
          {error.status} {error.statusText}
        </h1>
        <p className="mt-4 text-gray-500">{error.data}</p>
        <div className="mt-4">
          <Link to="/">← Back to start page</Link>
        </div>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Errorsssssssssss</h1>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
