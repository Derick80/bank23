import { Income } from '~/types/types'
import { dateRange } from './functions.server'
import { prisma } from './prisma.server'

export async function getCurrentIncomes(userId: number) {
  const { now, then } = dateRange()

  const income = await prisma.income.findMany({
    where: {
      userId: userId,
      dueDate: {
        gte: now,
        lte: then
      }
    },
    include: {
      incomeCategory: true
    }
  })
  const incomes = income.map((inc) => {
    return {
      id: inc.id,
      source: inc.source,
      amount: inc.amount,
      dueDate: inc.dueDate,
      categories: inc.incomeCategory
    }
  })
  return incomes.flat()
}
