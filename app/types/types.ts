import type {
  Expense as PrismaExpense,
  Income as PrismaIncome,
  ExpenseCategory,
  IncomeCategory,
  User as PrismaUser
} from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'

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

export type BandContainerObjectProps = {
  category: string
  amount: number
  percentage: number
  fills: string
}

export type SharedExpenseIncomeProps = {
  data: {
    id: number
    source: string
    amount: number
    dueDate: string
    categories: {
      id: number
      title: string
    }[]
  }[]

  type: 'expense' | 'income'
}
