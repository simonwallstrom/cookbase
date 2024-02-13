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
      <h1 className="text-5xl font-semibold tracking-tight">Cookbase</h1>
      <p className="ml-0.5 text-[17px] text-gray-500">Recipe organizer for families</p>
      <div className="absolute bottom-6 lg:bottom-8">
        <Link variant="button" prefetch="viewport" to="/login">
          Login →
        </Link>
      </div>
    </div>
  )
}
