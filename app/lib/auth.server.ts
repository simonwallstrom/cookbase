import type { User } from '@prisma/client'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET] as string[],
    secure: process.env.NODE_ENV === 'production',
  },
})

const USER_SESSION_KEY = 'userId'
const ORG_SESSION_KEY = 'orgId'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function getUserId(request: Request): Promise<User['id'] | undefined> {
  const session = await getSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}

export async function getOrgId(request: Request): Promise<User['organizationId'] | undefined> {
  const session = await getSession(request)
  const orgId = session.get(ORG_SESSION_KEY)
  return orgId
}

export async function requireAuth(request: Request) {
  const userId = await getUserId(request)
  const orgId = await getOrgId(request)

  if (!userId) {
    throw redirect('/login')
  }

  if (!orgId) {
    throw redirect('/no-account')
  }

  return { userId, orgId }
}

export async function createUserSession({
  request,
  userId,
  orgId,
  redirectTo,
}: {
  request: Request
  userId: string
  orgId: string | null
  redirectTo: string
}) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  session.set(ORG_SESSION_KEY, orgId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  })
}

export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
