import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="-mt-10 text-[clamp(72px,13vw,200px)] font-medium leading-tight tracking-tight dark:text-white">
        Cookbase
      </h1>
      <p className="ml-1 font-mono text-[clamp(16px,2vw,30px)] tracking-tight">
        Recipe organizer for families
      </p>
      <div className="absolute bottom-4 lg:bottom-8">
        <Link
          to="/recipes"
          className="px-8 py-2 font-mono font-semibold underline-offset-8 hover:underline lg:text-lg"
        >
          Login →
        </Link>
      </div>
    </div>
  )
}
