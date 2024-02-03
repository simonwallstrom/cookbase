import { json, useLoaderData } from '@remix-run/react'
import { Link } from '~/components/link'
import { prisma } from '~/lib/prisma.server'

export async function loader() {
  const recipes = await prisma.recipe.findMany()
  return json(recipes)
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  console.log(data)

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
