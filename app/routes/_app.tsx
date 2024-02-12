import { NavLink as RemixNavLink, Outlet } from '@remix-run/react'

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-6 pb-64 pt-6 sm:px-12 sm:pt-12">
        <Outlet />
      </main>
    </>
  )
}

function Header() {
  return (
    <header className="fixed inset-x-0 bottom-0 z-10 bg-white ring-1 ring-gray-950 ring-opacity-10 sm:sticky sm:top-0 dark:bg-gray-950 dark:ring-white dark:ring-opacity-[.085]">
      <div className="mx-auto flex w-full max-w-7xl items-center px-6 max-sm:justify-between sm:gap-12 sm:px-12">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/meal-planner">Meal&nbsp;planner</NavLink>
        <div className="sm:ml-auto">
          <NavLink to="/settings">Settings</NavLink>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <RemixNavLink
      prefetch="intent"
      draggable="false"
      className={({ isActive }) =>
        'group touch-none select-none py-5 font-medium outline-none ' +
        (isActive ? '' : 'text-gray-500 hover:text-inherit')
      }
      to={to}
    >
      <span className="inline-flex group-focus-visible:bg-yellow-300 group-focus-visible:text-gray-950">
        {children}
      </span>
    </RemixNavLink>
  )
}
