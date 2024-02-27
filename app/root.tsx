import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'

import './tailwind.css'
import { Toaster } from '~/components/toaster'

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg' },
  { rel: 'preload', href: '/UncutSans.woff2', crossOrigin: 'anonymous', as: 'font' },
]

export const meta: MetaFunction = () => {
  return [{ title: 'Cookbase' }, { name: 'description', content: 'Recipe organizer for families' }]
}

export default function App() {
  return (
    <html
      className="h-full text-gray-950 selection:bg-yellow-200 dark:bg-gray-950 dark:text-gray-300 dark:selection:text-gray-950"
      lang="en"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-full w-full flex-col">
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
