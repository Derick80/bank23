import { json, LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'
import stylesheet from '~/tailwind.css'
import { isAuthenticated } from './server/auth/auth.server'
import { prisma } from './server/prisma.server'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet }
]
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
})
export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  const eCategories = await prisma.expenseCategory.findMany({
    select: {
      id: true,
      title: true
    }
  })
  const iCategories = await prisma.incomeCategory.findMany({
    select: {
      id: true,
      title: true
    }
  })
  return json({ user, eCategories, iCategories })
}
export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='bg-slate-50 text-black dark:bg-slate-800 dark:text-slate-50'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
