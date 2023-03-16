import { json, LoaderArgs } from '@remix-run/node'
import { prisma } from '~/server/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
  const categoryId = Number(params.categoryId)
  if (!categoryId) {
    throw new Error('No category id provided')
  }

  const itemByCategory = await prisma.incomeCategory.findMany({
    where: {
      id: categoryId
    },
    include: {
      incomes: true
    }
  })

  return json({ itemByCategory })
}
