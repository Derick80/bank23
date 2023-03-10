import type {
  Expense as PrismaExpense,
  Income as PrismaIncome,
  ExpenseCategory,
  IncomeCategory,
  User as PrismaUser
} from '@prisma/client'

export type AuthInput = {
  email: string
  username: string
  password: string
}
export type User = Omit<PrismaUser, 'password' | 'createdAt'>

export type UserType = User & {
  expenses: Expense[]
  incomes: Income[]
}

export type Expense = PrismaExpense & {
  user: User
  expenseCategory: ExpenseCategory[]
}

export type Income = PrismaIncome & {
  user: User
  incomeCategory: IncomeCategory[]
}

export type CommonEntries = {
  data: {
    id: number
    source: string
    amount: number
    dueDate: Date
    categories: {
      id: number
      title: string
    }[]
  }
}[]
export type CorrectedIncome = SerializeFrom<CommonEntries>
