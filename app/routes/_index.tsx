import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '~/components/link'
import { getUserId } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/home')
  return null
}

export default function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-5xl font-semibold tracking-tight">Cookbase</h1>
        <p className="ml-0.5 mt-1 font-medium">Recipe organizer for families</p>
      </div>
      <div className="absolute bottom-8 z-10 flex flex-col items-center gap-8">
        <div>
          <Link
            className="px-8 ring-4 ring-white dark:ring-gray-950"
            variant="button"
            prefetch="viewport"
            to="/login"
          >
            Login →
          </Link>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
          <Link className="bg-white dark:bg-gray-950" to="/request-access">
            Request access
          </Link>
          <Link className="bg-white dark:bg-gray-950" to="/">
            Changelog
          </Link>
          <Link className="bg-white dark:bg-gray-950" to="/design-system">
            Design system
          </Link>
        </div>
      </div>
      <div className="fixed left-0 top-0 animate-[fadeIn_.5s_ease-in-out]">
        <img src="/images/food-top-left.svg" alt="" />
      </div>
      <div className="fixed bottom-0 right-0 hidden animate-[fadeIn_.5s_ease-in-out] md:block">
        <img src="/images/food-bottom-right.svg" alt="" />
      </div>
    </div>
  )
}
