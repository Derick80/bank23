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
    },
    orderBy: {
      dueDate: 'asc'
    }
  })
  return incomes
}

export async function getIncomeById(id: number) {
  const income = await prisma.income.findUnique({
    where: {
      id: id
    },
    include: {
      categories: true
    }
  })
  return income
}
