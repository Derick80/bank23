import { dateRange } from './functions.server'
import { prisma } from './prisma.server'

export async function getCurrentExpenses(userId: number) {
  const { now, then } = dateRange()

  const expense = await prisma.expense.findMany({
    where: {
      userId: userId,
      dueDate: {
        gte: now,
        lte: then
      }
    },
    include: {
      expenseCategory: true
    }
  })
  const expenses = expense.map((exp) => {
    return {
      id: exp.id,
      source: exp.source,
      amount: exp.amount,
      dueDate: exp.dueDate,
      categories: exp.expenseCategory,
      userId: exp.userId
    }
  })
  return expenses.flat()
}
