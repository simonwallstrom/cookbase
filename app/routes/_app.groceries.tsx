import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { requireAuth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request)

  return null
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const food = formData.get('food')
  console.log(food)
  return null
}

export default function MealPlanner() {
  return (
    <div className="">
      <h1 className="text-3xl font-semibold tracking-tight">Groceries</h1>
      <p className="mt-3 text-gray-500">
        This section is still work in progress – Check back soon.
      </p>
      <Form method="post">
        <input type="text" name="food" />
        <button>Add food</button>
      </Form>
    </div>
  )
}
