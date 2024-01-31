import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="-mt-10 text-[10vw] font-medium leading-none tracking-tight">Cookbase</h1>
      <p className="text-[3vw] text-gray-500 lg:ml-1">Recipe organizer for families</p>
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
