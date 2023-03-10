import { ExpenseCategory, IncomeCategory } from '@prisma/client'
import { ActionArgs, json } from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { redirect, useRouteLoaderData } from 'react-router'
import CategoryCreator from '~/compoonents/category-creater'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function action({ request }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ message: 'Not Authenticated' }, { status: 401 })
  }
  const formData = await request.formData()
  const source = formData.get('source')
  const amount = Number(formData.get('amount'))
  const dueDate = formData.get('dueDate')
  const title = formData.get('category') as string
  const type = formData.get('type')

  if (
    typeof source !== 'string' ||
    typeof amount !== 'number' ||
    typeof dueDate !== 'string' ||
    typeof type !== 'string'
  ) {
    return json({ message: 'Invalid Form Data' }, { status: 400 })
  }

  switch (type) {
    case 'expense':
      await prisma.expense.create({
        data: {
          source,
          amount,
          dueDate: new Date(dueDate),
          userId: user.id,
          expenseCategory: {
            connect: {
              title
            }
          }
        }
      })
      return redirect('/')
    case 'income':
      await prisma.income.create({
        data: {
          source,
          amount,
          dueDate: new Date(dueDate),
          userId: user.id,
          incomeCategory: {
            connect: {
              title
            }
          }
        }
      })
      return redirect('/')
    default:
      return json({ message: 'default Form Data' }, { status: 400 })
  }
}

export default function NewRoute() {
  const routeData = useRouteLoaderData('root') as {
    iCategories: IncomeCategory[]
    eCategories: ExpenseCategory[]
    user: { id: number; email: string }
  }
  const eCategories = routeData.eCategories as ExpenseCategory[]
  const iCategories = routeData.iCategories as IncomeCategory[]

  const [type, setType] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value)
    console.log(e.target.value)
  }

  return (
    <div className='mx-auto flex flex-col items-center'>
      <h1 className='text-2xl'>New Expense or Income</h1>
      <Form
        method='post'
        id='new'
        className='flex w-full flex-col space-y-2 rounded-md p-4 shadow-md'
      >
        <label className='font-semibold' htmlFor='source'>
          Source
        </label>
        <input
          className='rounded-md border shadow-sm'
          type='text'
          name='source'
        />
        <label className='font-semibold' htmlFor='amount'>
          Amount
        </label>
        <input
          className='rounded-md border shadow-sm'
          type='number'
          name='amount'
        />
        <label className='font-semibold' htmlFor='dueDate'>
          Due Date
        </label>
        <input
          className='rounded-md border shadow-sm'
          type='date'
          name='dueDate'
        />
        <label className='font-semibold' htmlFor='type'>
          Type
        </label>
        <div className='flex flex-row space-x-2'>
          <label className='font-semibold' htmlFor='expense'>
            Expense
          </label>
          <input
            className='rounded-md border shadow-sm'
            type='radio'
            name='type'
            value='expense'
            onChange={(e) => handleChange(e)}
          />
          <label className='font-semibold' htmlFor='income'>
            Income
          </label>
          <input
            className='rounded-md border shadow-sm'
            type='radio'
            name='type'
            value='income'
            onChange={(e) => handleChange(e)}
          />
        </div>

        <select name='category' id='category'>
          {type === 'expense'
            ? eCategories.map((category) => {
                return (
                  <option key={category.id} value={category.title}>
                    {category.title}
                  </option>
                )
              })
            : iCategories.map((category) => {
                return (
                  <option key={category.id} value={category.title}>
                    {category.title}
                  </option>
                )
              })}
        </select>

        <button type='submit' form='new'>
          Submit
        </button>
      </Form>
      <details className='flex flex-col space-y-2'>
        <summary className='font-semibold'>Create New Category</summary>
        <CategoryCreator />
      </details>
      <pre className='text-xs'>{JSON.stringify(eCategories, null, 2)}</pre>
      <pre className='text-xs'>{JSON.stringify(iCategories, null, 2)}</pre>
    </div>
  )
}
