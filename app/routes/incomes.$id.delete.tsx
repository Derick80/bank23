import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function action({ request, params }: ActionArgs) {
  const id = Number(params.id)
  if (!id) {
    return json({ error: 'No id provided' })
  }
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ message: 'Not Authenticated' }, { status: 401 })
  }

  await prisma.income.delete({
    where: {
      id
    }
  })
  return json({ message: 'Income Deleted' })
}
