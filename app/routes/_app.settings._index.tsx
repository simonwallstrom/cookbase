import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Link } from '~/components/link'
import { Switch } from '~/components/switch'
import { requireAuth } from '~/lib/auth.server'
import { getInvitation, resetInvitation, toggleInvitation } from '~/models/invitation.server'
import { getMembersById } from '~/models/organization.server'
import { getUserById } from '~/models/user.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, orgId } = await requireAuth(request)
  const user = await getUserById(userId)
  const members = await getMembersById(orgId)
  const invitation = await getInvitation(orgId)

  const url = new URL(request.url).host
  const inviteLink = `${url}/invite/${invitation?.id}`

  return json({ user, members, invitation, inviteLink })
}

const schema = z.discriminatedUnion('_action', [
  z.object({
    _action: z.enum(['TOGGLE_LINK']),
    invitationId: z.string().cuid(),
    enabled: z.coerce.boolean(),
  }),
  z.object({ _action: z.enum(['RESET_LINK']), invitationId: z.string().cuid() }),
])

export async function action({ request }: ActionFunctionArgs) {
  const { orgId } = await requireAuth(request)
  const formData = await request.formData()

  const result = schema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  if (result.data._action === 'TOGGLE_LINK') {
    await toggleInvitation(orgId, result.data.invitationId, result.data.enabled)
    return json({ errors: null }, { status: 200 })
  }

  if (result.data._action === 'RESET_LINK') {
    await resetInvitation(orgId, result.data.invitationId)
    return json({ errors: null }, { status: 200 })
  }

  throw new Error('Unknown action')
}

export default function Settings() {
  const data = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const navigation = useNavigation()
  const [copyInviteLink, setCopyInviteLink] = useState(false)

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(data.inviteLink).then(function () {
      setCopyInviteLink(true)
      setTimeout(() => {
        setCopyInviteLink(false)
      }, 2500)
    })
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-pretty text-gray-500">
          Manage your account settings and profile details
        </p>
      </div>

      {/* Profile details */}
      <div className="mt-6 bg-gray-100 p-6 sm:mt-12 sm:p-12 dark:border dark:bg-gray-900">
        <h2 className="text-2xl font-semibold">Profile details</h2>
        <p className="mt-2 text-pretty text-gray-600 dark:text-gray-400">
          Your personal information. Update your name and email address in this section.
        </p>
        <div className="mt-6 grid divide-y divide-dashed border-y border-dashed">
          <div className="flex flex-col gap-y-1 py-3 sm:flex-row">
            <div className="text-gray-500 sm:w-44">Name</div>
            <div className="flex flex-1 justify-between">
              <div className="font-medium">
                {data.user?.firstName} {data.user?.lastName}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 py-3 sm:flex-row">
            <div className="text-gray-500 sm:w-44">Email address</div>
            <div className="flex flex-1 justify-between">
              <div className="font-medium">{data.user?.email}</div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 py-3 sm:flex-row">
            <div className="text-gray-500 sm:w-44">Password</div>
            <div className="flex flex-1 justify-between">
              <div className="font-mono font-medium">**********</div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Form action="/api/logout" method="post">
            <Button variant="link" type="submit">
              Logout
            </Button>
          </Form>
        </div>
      </div>

      {/* Account settings */}
      <div className="mt-6 bg-gray-100 p-6 sm:mt-12 sm:p-12 dark:border dark:bg-gray-900">
        <h2 className="text-2xl font-semibold">Family account</h2>
        <p className="mt-2 text-pretty text-gray-600 dark:text-gray-400">
          Your shared information. Manage your account and invite family members.
        </p>
        <div className="mt-6 grid divide-y divide-dashed border-y border-dashed">
          <div className="flex flex-col gap-y-1 py-3 sm:flex-row">
            <div className="text-gray-500 sm:w-44">Account name</div>
            <div className="flex flex-1 justify-between">
              <div className="font-medium">{data.user?.organization.name}</div>
              <div>
                <Link to="/settings/account/name">Edit</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 py-3 sm:flex-row">
            <div className="text-gray-500 sm:w-44">Members</div>
            <div className="flex flex-1 justify-between">
              <div className="grid flex-1 gap-1.5">
                {data.members.map((member) => (
                  <div className="flex items-center gap-2" key={member.id}>
                    <div>
                      <span className="font-medium">{member.firstName} </span>
                      <span className="text-sm font-normal lowercase text-gray-500">
                        ({member.role})
                      </span>
                    </div>
                    <div>
                      <button className="flex h-6 w-6 items-center justify-center font-bold hover:bg-gray-200 dark:hover:bg-gray-800">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-3">
            <div className="flex flex-col gap-y-1 sm:flex-row">
              <div className="text-gray-500 sm:w-44">Invite link</div>
              <div className="flex flex-1 justify-between gap-6">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Activate a secure link that you can use to invite family members to your
                    account.
                  </div>
                </div>
                <Form
                  onChange={(event) => {
                    submit(event.currentTarget)
                  }}
                  action="/settings"
                  className="flex"
                  method="post"
                >
                  <input type="hidden" name="invitationId" value={data.invitation?.id} />
                  <input type="hidden" name="_action" value="TOGGLE_LINK" />
                  <Switch name="enabled" defaultChecked={data.invitation?.isEnabled} />
                </Form>
              </div>
            </div>
            {data.invitation?.isEnabled ? (
              <div className="md:ml-44">
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Input readOnly className="flex-1 md:max-w-96" value={data.inviteLink} />
                  <Button className="w-full sm:w-28" onClick={handleCopyInviteLink}>
                    {copyInviteLink ? <span>Copied!</span> : <span>Copy&nbsp;link</span>}
                  </Button>
                </div>
                <Form method="post" action="/settings">
                  <input type="hidden" name="invitationId" value={data.invitation?.id} />
                  <div className="mt-4 text-sm text-gray-500">
                    Anyone with the link can join your account. If the link has been compromised you
                    can{' '}
                    <Button
                      variant="link"
                      type="submit"
                      name="_action"
                      disabled={navigation.state !== 'idle'}
                      value="RESET_LINK"
                    >
                      {navigation.state !== 'idle' ? (
                        <span>Resetting...</span>
                      ) : (
                        <span>reset&nbsp;the&nbsp;link</span>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}