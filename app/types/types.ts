import type {
  Expense as PrismaExpense,
  Income as PrismaIncome,

  User as PrismaUser
} from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

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

export type Expenses = PrismaExpense & {
  user: User
  categories: Categories[]
}

export type Expense= SerializeFrom<Expenses>

export type Incomes = PrismaIncome & {
  user: User
  categories: Categories[]
}

export type Income = SerializeFrom<Incomes>
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

export type Categories = {
  id: number
  title: string
  type: string
}


