import { type LoaderFunctionArgs, json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { createUserSession, getUserId } from '~/lib/auth.server'
import { createUser, getUserByEmail } from '~/models/user.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/home')
  return null
}

const schema = z.object({
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

  const user = await createUser(result.data)

  return createUserSession({
    request,
    userId: user.id,
    orgId: user.organizationId,
    redirectTo: '/recipes',
  })
}

export default function Signup() {
  const actionData = useActionData<typeof action>()

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xs text-center">
        <h1 className="text-5xl font-bold">Signup</h1>
        <p className="mt-3 text-gray-500">Create an account to get started</p>
        <Form method="post" className="mt-8 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="sr-only" htmlFor="firstName">
                First name
              </label>
              <Input
                className="focus:relative"
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
          <div className="mt-2">
            <Button>Create account</Button>
          </div>
          <div className="mt-4 flex gap-6 text-sm text-gray-500">
            <Link to="/login">Login</Link>
            <Link to="/login">Return home</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}