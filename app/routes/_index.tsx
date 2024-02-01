import { Link, json, useLoaderData } from '@remix-run/react'
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
      <h1 className="-mt-10 text-[clamp(60px,10vw,150px)] font-bold tracking-tighter">Cookbase</h1>
      <p className="text-[clamp(16px,3vw,30px)] text-gray-500 lg:ml-1">
        Recipe organizer for families
      </p>
      <div className="absolute bottom-4 lg:bottom-8">
        <Link
          to="/recipes"
          className="px-8 py-2 font-medium underline-offset-8 hover:underline lg:text-lg"
        >
          Login →
        </Link>
      </div>
    </div>
  )
}
