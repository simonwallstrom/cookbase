import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'

import './tailwind.css'
import { Toaster } from '~/components/toaster'

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'preload', href: '/UncutSans.woff2', crossOrigin: 'anonymous', as: 'font' },
]

export const meta: MetaFunction = () => {
  return [{ title: 'Cookbase' }, { name: 'description', content: 'Recipe organizer for families' }]
}

export default function App() {
  return (
    <html
      className="h-full min-h-[calc(100%_+_env(safe-area-inset-top))] text-gray-950 selection:bg-yellow-200 dark:bg-gray-950 dark:text-gray-300 dark:selection:text-gray-950"
      lang="en"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#131316" />
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
