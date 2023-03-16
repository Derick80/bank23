import type { IncomeCategory, ExpenseCategory } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  useLoaderData,
  useRouteLoaderData,
  Form,
  useNavigation
} from '@remix-run/react'
import { format } from 'date-fns'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import type { Expense } from '~/types/types'

export async function loader({ request, params }: LoaderArgs) {
  const { id } = params
  if (!id) {
    return json({ error: 'No id provided' })
  }

  const expense = await prisma.expense.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      expenseCategory: true
    }
  })
  if (!expense) {
    return json({ error: 'No expense found' })
  }

  return json({ expense })
}

export async function action({ request, params }: ActionArgs) {
  const id = Number(params.id)
  if (!id) {
    return json({ error: 'No id provided' })
  }
  console.log(id, 'id')

  const user = await isAuthenticated(request)
  invariant(user, 'You must be logged in to edit an expense')
  const formData = await request.formData()
  const source = formData.get('source')
  const amount = Number(formData.get('amount'))
  const dueDate = formData.get('dueDate')
  const title = formData.get('category')

  if (
    typeof source !== 'string' ||
    typeof amount !== 'number' ||
    typeof title !== 'string' ||
    typeof dueDate !== 'string'
  ) {
    return json({ error: 'Invalid form data' })
  }

  const expense = await prisma.expense.update({
    where: {
      id
    },
    data: {
      source,
      amount,
      dueDate: new Date(dueDate),
      categories: {
        set: {
          title
        }
      }
    }
  })
  return json({ expense })
}

export default function EditRoute() {
  const { expense } = useLoaderData<{ expense: Expense }>()
  const navigate = useNavigation()
  const routeData = useRouteLoaderData('root') as {
   categories: { id: number; title: string; type: 'income' | 'expense' }[]
    user: { id: number; email: string }
  }

  const eCategories = routeData.categories.filter(
    (category) => category.type === 'expense'
  )

  const [defaultOption] = expense.categories.map(
    (category: { id: number; title: string }) => category.title
  )
  console.log(defaultOption, 'defaultOption')

  return (
    <div className='mx-auto flex flex-col items-center'>
      <h1 className='text-4xl font-bold'>Edit</h1>
      <Form
        method='post'
        className='flex w-full flex-col space-y-2 rounded-md p-4 shadow-md'
      >
        <label htmlFor='source'>Source</label>
        <input
          className='rounded-md border p-2 text-black shadow-sm'
          defaultValue={expense.source}
          type='text'
          name='source'
          id='source'
        />
        <label htmlFor='amount'>Amount</label>
        <input
          className='rounded-md border p-2 text-black shadow-sm'
          defaultValue={expense.amount}
          type='number'
          name='amount'
          id='amount'
        />
        <label htmlFor='dueDate'>Due Date</label>
        <input
          className='rounded-md border p-2 text-black shadow-sm'
          type='date'
          name='dueDate'
          id='dueDate'
          defaultValue={format(new Date(expense.dueDate), 'yyyy-MM-dd')}
        />
        {expense.categories && (
          <select
            name='category'
            id='category'
            className='rounded-md border p-2 text-black shadow-sm'
          >
            {eCategories.map((category) => {
              return (
                <option
                  key={category.id}
                  selected={category.title === defaultOption}
                >
                  {category.title}
                </option>
              )
            })}
          </select>
        )}

        <button type='submit'>
          {' '}
          <p>{navigate.state === 'submitting' ? 'Saving...' : 'Save'}</p>
        </button>
      </Form>

      <pre className='text-xs'>{JSON.stringify(expense, null, 2)}</pre>
    </div>
  )
}
