import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, redirect } from '@remix-run/react'
import { Link } from '~/components/link'
import { requireAuth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuth(request)
  if (!userId) return redirect('/login')
  return null
}

export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 sm:p-12">
      <header>
        <div className="font-medium text-gray-500">Familjen Wallström</div>
      </header>

      <div className="mt-6 grid divide-y border-t sm:mt-12">
        <div className="py-6 sm:py-12">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Family account</h2>
          <div className="mt-4">
            <span className="text-gray-500">You belong to the family account</span> Familjen
            Wallström.{' '}
            <span className="text-gray-500">Your family shares 88 recipes together.</span>{' '}
            <Link to="/recipes">View recipes →</Link>
          </div>
        </div>
        <div className="py-6 sm:py-12">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">User details</h2>
          <Form className="mt-4" action="/api/logout" method="post">
            <span>
              <span className="text-gray-500">Logged in as</span> Simon Wallström.{' '}
            </span>
            <button type="submit" className="underline-offset-4 hover:underline">
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}
