import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useCallback } from 'react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { requireAuth } from '~/lib/auth.server'
import { getUserById, updateUserName } from '~/models/user.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requireAuth(request)
  const user = await getUserById(userId)

  if (!user) {
    throw new Response('User not found', { status: 404, statusText: 'Not found' })
  }

  return { user }
}

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
})

export async function action({ request }: ActionFunctionArgs) {
  const { userId } = await requireAuth(request)
  const formData = await request.formData()
  const result = schema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  await updateUserName({ userId, ...result.data })

  return redirect('/settings#profile')
}

export default function SettingsProfileName() {
  const { user } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  const ref = useCallback((node: HTMLInputElement) => {
    node?.focus()
  }, [])

  return (
    <div className="max-w-xl">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Edit profile name</h1>
        <p className="text-pretty text-gray-500">
          Update your first- and last name in the field below or{' '}
          <Link to="/settings#profile">click here to cancel</Link>.
        </p>
      </div>
      {/* Form */}
      <Form method="post" className="mt-4 md:mt-8">
        <div className="grid gap-1.5">
          <label className="font-medium" htmlFor="firstName">
            First name
          </label>
          <Input
            ref={ref}
            defaultValue={user.firstName}
            type="text"
            required
            name="firstName"
            id="firstName"
          />
          {actionData?.errors?.fieldErrors.firstName ? (
            <div className="text-sm text-red-400">{actionData?.errors?.fieldErrors.firstName}</div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-1.5 md:mt-8">
          <label className="font-medium" htmlFor="lastName">
            Last name
          </label>
          <Input defaultValue={user.lastName} type="text" required name="lastName" id="lastName" />
          {actionData?.errors?.fieldErrors.lastName ? (
            <div className="text-sm text-red-400">{actionData?.errors?.fieldErrors.lastName}</div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center gap-6 md:mt-10">
          <Button disabled={navigation.state !== 'idle'}>Update name</Button>
          <Link to="/settings#profile">Cancel</Link>
        </div>
      </Form>
    </div>
  )
}
