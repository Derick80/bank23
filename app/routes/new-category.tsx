import { ActionArgs, json, LoaderArgs, redirect } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function action({ request }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ message: 'Not Authenticated' }, { status: 401 })
  }
  const formData = await request.formData()
  const title = formData.get('title')
  const type = formData.get('type')

  if (typeof title !== 'string' || typeof type !== 'string') {
    return json({ message: 'Invalid Form Data' }, { status: 400 })
  }

  switch (type) {
    case 'expense':
      const expenses = await prisma.category.create({
        data: {
          title,
          type: 'expense'
        }
      })
      return json({ expenses })
    case 'income':
      const incomes = await prisma.category.create({
        data: {
          title,
          type: 'income'
        }
      })
      return json({ incomes })
    default:
      return json({ message: 'default Form Data' }, { status: 400 })
  }
}
