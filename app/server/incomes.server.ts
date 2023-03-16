import { dateRange } from './functions.server'
import { prisma } from './prisma.server'

export async function getCurrentIncomes(userId: number) {
  const { now, then } = dateRange()

  const incomes = await prisma.income.findMany({
    where: {
      userId: userId,
      dueDate: {
        gte: now,
        lte: then
      }
    },
    include: {
      categories: true
    }
  })
  return incomes
}
