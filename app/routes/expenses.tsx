import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  const userId = user?.id

  const expenses = await prisma.expense.findMany({
    where: {
      id: userId
    }
  })

  return json({ expenses })
}
