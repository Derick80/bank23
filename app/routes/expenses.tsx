import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData, useParams } from '@remix-run/react'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('Not authenticated')
  }

  const expenses = await prisma.expense.findMany({
    where: {
      id: user.id
    },
    include: {
      categories: true
    }
  })

  return json({ expenses })
}
export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <details>
        <summary>View Code</summary>
        <pre className='text-sm text-gray-500'>
          {JSON.stringify(data.expenses, null, 2)}
        </pre>
      </details>
    </>
  )
}

export function CatchBoundry() {
  const caught = useCatch()
  const params = useParams()

  switch (caught.status) {
    case 404: {
      return <h2>User with ID "{params.userId}" not found!</h2>
    }
    default: {
      // if we don't handle this then all bets are off. Just throw an error
      // and let the nearest ErrorBoundary handle this
      throw new Error(`${caught.status} not handled`)
    }
  }
}
export function ErrorBoundary({ error }: any) {
  return (
    <div>
      <h1 className='text-3xl font-bold'>Incomes root ERROR</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  )
}
