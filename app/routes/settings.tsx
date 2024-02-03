import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, redirect } from '@remix-run/react'
import { requireAuth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuth(request)
  if (!userId) return redirect('/login')
  return null
}

export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 sm:p-12">
      <header className="flex w-full items-center justify-between font-medium">
        <div className="text-gray-500">Familjen Wallström</div>
        <Form action="/api/logout" method="post">
          <button
            type="submit"
            className="font-medium underline decoration-gray-300 decoration-wavy underline-offset-4 hover:decoration-gray-950"
          >
            Logout
          </button>
        </Form>
      </header>

      <div className="mt-6 flex items-center justify-between border-t py-12 sm:mt-12">
        <h1 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">88 recipes</h1>
        <div>
          <Link
            to="/recipes"
            className="font-medium underline decoration-gray-300 decoration-wavy underline-offset-4 hover:decoration-gray-950"
          >
            View recipes
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between border-y py-12">
        <h1 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">2 members</h1>
        <div>
          <Link
            to="/recipes"
            className="font-medium underline decoration-gray-300 decoration-wavy underline-offset-4 hover:decoration-gray-950"
          >
            View members
          </Link>
        </div>
      </div>
    </div>
  )
}
