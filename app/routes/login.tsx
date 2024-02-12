import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, redirect, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Label } from '~/components/label'
import { Link } from '~/components/link'
import { createUserSession, getUserId } from '~/lib/auth.server'
import { verifyLogin } from '~/models/user.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/recipes')
  return null
}

const schema = z
  .object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string().min(6, 'Password must be atleast 6 characters long'),
  })
  .transform(async (val, ctx) => {
    const user = await verifyLogin(val.email, val.password)

    if (!user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid email or password',
      })
      return z.NEVER
    }
    return user
  })

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const result = await schema.safeParseAsync(Object.fromEntries(formData))

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  return createUserSession({
    request,
    userId: result.data.id,
    orgId: result.data.organizationId,
    redirectTo: '/recipes',
  })
}

export default function Login() {
  const actionData = useActionData<typeof action>()

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xs text-center">
        <h1 className="text-5xl font-semibold tracking-tight">Login</h1>
        <p className="mt-3 text-gray-500">Welcome back to Cookbase</p>

        <Form method="post" className="mt-8 flex flex-col gap-5">
          <div className="grid">
            <Label className="sr-only" htmlFor="email">
              Email address
            </Label>
            <Input type="email" placeholder="Email address..." required name="email" id="email" />
            {actionData?.errors?.fieldErrors.email ? (
              <div className="text-red text-sm">{actionData?.errors?.fieldErrors.email}</div>
            ) : null}
          </div>
          <div className="grid">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              name="password"
              placeholder="Password..."
              required
              id="password"
              type="password"
            />
            {actionData?.errors?.fieldErrors.password ? (
              <div className="text-red text-sm">{actionData?.errors?.fieldErrors.password}</div>
            ) : null}
          </div>
          <div>
            <Button className="w-full">Login to continue</Button>
          </div>
        </Form>
        <div className="mt-8 text-sm text-gray-500">
          <span>Don&apos;t have an account yet?</span> <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  )
}
