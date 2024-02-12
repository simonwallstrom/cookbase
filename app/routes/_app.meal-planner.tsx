import type { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request)

  return null
}

export default function MealPlanner() {
  return (
    <div className="">
      <h1 className="text-3xl font-semibold tracking-tight">Meal planner</h1>
      <p className="mt-3 text-gray-500">
        This section is still work in progress – Check back soon.
      </p>
    </div>
  )
}
