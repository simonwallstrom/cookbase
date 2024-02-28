import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useCallback } from 'react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { requireAuth } from '~/lib/auth.server'
import { getOrganizationById, updateOrganizationName } from '~/models/organization.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const { orgId } = await requireAuth(request)
  const org = await getOrganizationById(orgId)
  return { org }
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export async function action({ request }: ActionFunctionArgs) {
  const { orgId } = await requireAuth(request)
  const formData = await request.formData()

  const name = formData.get('name')
  const result = schema.safeParse({ name })

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  await updateOrganizationName(orgId, result.data.name)

  return redirect('/settings#account')
}

export default function SettingsAccountName() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  const ref = useCallback((node: HTMLInputElement) => {
    node?.focus()
  }, [])

  return (
    <div className="max-w-2xl">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Edit account name</h1>
        <p className="text-pretty text-gray-500">
          Update your account name in the field below or{' '}
          <Link to="/settings#account">click here to cancel</Link>.
        </p>
      </div>
      {/* Form */}
      <Form method="post" className="mt-4 md:mt-8">
        <div className="grid gap-1.5">
          <label className="font-medium" htmlFor="name">
            Account name
          </label>
          <Input
            ref={ref}
            defaultValue={data.org?.name ? data.org?.name : ''}
            type="text"
            required
            name="name"
            id="name"
          />
          {actionData?.errors?.fieldErrors.name ? (
            <div className="text-sm text-red-600">{actionData?.errors?.fieldErrors.name}</div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center gap-6 md:mt-10">
          <Button disabled={navigation.state !== 'idle'}>Update name</Button>
          <Link to="/settings#account">Cancel</Link>
        </div>
      </Form>
    </div>
  )
}
