import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '~/components/link'
import { getUserId } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/recipes')
  return null
}

export default function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-5xl font-bold tracking-tighter">Cookbase</h1>
      <p className="mt-2 font-medium text-gray-500">Recipe organizer for families</p>
      <div className="absolute bottom-4 lg:bottom-8">
        <Link to="/login" className="p-2 font-medium">
          Login →
        </Link>
      </div>
    </div>
  )
}
