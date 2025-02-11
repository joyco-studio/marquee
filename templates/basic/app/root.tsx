import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, type MetaFunction } from 'react-router'

import type { Route } from './+types/root'
import './app.css'
import '@/lib/scroll'
import Header from './components/header'
import { generateMeta } from './lib/meta'
import { SITE_URL } from './lib/constants'
import { generateLinks } from './lib/links'
import stylesheet from './app.css?url'

export const links: Route.LinksFunction = () =>
  generateLinks({
    stylesheets: [stylesheet, 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&display=swap'],
    favicon: {
      '32x32': '/favicon-32x32.png',
      '16x16': '/favicon-16x16.png',
      'apple-touch-icon': '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    preconnect: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ],
    preload: [
      {
        href: 'https://fonts.gstatic.com/s/barlowcondensed/v12/HTxwL3I-JCGChYJ8VI-L6OO_au7B46r2z3bWuYMBYro.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  })

export const meta: MetaFunction = () => {
  const meta = generateMeta({
    strict: true,
    title: 'JOYCO | Marquee',
    description:
      'A high-performance marquee component leveraging the Web Animations API (WAAPI) for smooth, performant scrolling animations with precise control and runtime flexibility.',
    url: SITE_URL,
    siteName: 'JOYCO Marquee',
    image: { url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })

  return meta
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
