import type { IncomeCategory, ExpenseCategory } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import type { Categories, Income } from '~/types/types'

export async function loader({ request, params }: LoaderArgs) {
  const { id } = params
  if (!id) {
    return json({ error: 'No id provided' })
  }

  const income = await prisma.income.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      categories: true
    }
  })
  if (!income) {
    return json({ error: 'No income found' })
  }

  return json({ income })
}

export async function action({ request, params }: ActionArgs) {
  const id = Number(params.id)
  if (!id) {
    return json({ error: 'No id provided' })
  }
  const user = await isAuthenticated(request)
  invariant(user, 'You must be logged in to edit an income')
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

  const income = await prisma.income.update({
    where: {
      id
    },
    data: {
      source,
      amount,
      dueDate: new Date(dueDate),
      categories: {
              set: {
          title,

        },

      }
    }
  })
  return json({ income })
}

export default function EditRoute() {
  const { income } = useLoaderData<{ income: Income }>()

  const routeData = useRouteLoaderData('root') as {
   categories:Categories[]
    user: { id: number; email: string }
  }

  const iCategories = routeData.categories.filter(
    (category) => category.type === 'income'
  ) as IncomeCategory[]
  const [defaultOption] = income.categories.map(
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
          defaultValue={income.source}
          type='text'
          name='source'
          id='source'
        />
        <label htmlFor='amount'>Amount</label>
        <input
          className='rounded-md border p-2 text-black shadow-sm'
          defaultValue={income.amount}
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
          defaultValue={format(new Date(income.dueDate), 'yyyy-MM-dd')}
        />
        {income.categories && (
          <select
            name='category'
            id='category'
            className='rounded-md border p-2 text-black shadow-sm'
          >
            {iCategories.map((category) => {
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

        <button type='submit'>Submit</button>
      </Form>

      <pre className='text-xs'>{JSON.stringify(income, null, 2)}</pre>
    </div>
  )
}
