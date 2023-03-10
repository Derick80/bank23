import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { NavLink, useFetcher } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import type { Expense } from '~/types/types'

export type DTPropsExpense = {
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

export type DTPropsIncome = {
  data: Expense[]
  category: {
    id: number
    title: string
  }[]
  type: 'expense' | 'income'
}
export default function DataTable({ data, type }: DTPropsExpense) {
  const [edit, setEdit] = React.useState(false)
  const deleteFetcher = useFetcher()

  // console.log(categories, 'category');

  const isIncome = type === 'income' ? true : false

  return (
    <>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Source</th>
            <th className='px-4 py-2'>Category</th>

            <th className='px-4 py-2'>Due Date</th>
            <th className='px-4 py-2'>Amount</th>
            <th className='px-4 py-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {edit ? (
                <>
                  <td className='border px-4 py-2'>
                    <input
                      type='text'
                      name='source'
                      id='source'
                      defaultValue={item.source}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className='border px-4 py-2'>{item.source}</td>
                </>
              )}
              <td className='border px-4 py-2'>
                {item.categories.map((category, index) => (
                  <span key={index}>{category.title.split(',')}</span>
                ))}
              </td>
              <td className='border px-4 py-2'>
                {format(new Date(item.dueDate), 'MMM yy')}
              </td>
              <td className='border px-4 py-2'>{item.amount}</td>
              <td className='border px-4 py-2'>
                {isIncome ? (
                  <NavLink to={`/incomes/${item.id}/edit`}>
                    <button
                      onClick={() => {
                        setEdit(!edit)
                      }}
                      className='text-blue-500'
                    >
                      <Pencil2Icon />
                    </button>
                  </NavLink>
                ) : (
                  <NavLink to={`/expenses/${item.id}/edit`}>
                    <button
                      onClick={() => {
                        setEdit(!edit)
                      }}
                      className='text-blue-500'
                    >
                      <Pencil2Icon />
                    </button>
                  </NavLink>
                )}
                {isIncome ? (
                  <deleteFetcher.Form
                    method='post'
                    action={`/incomes/${item.id}/delete`}
                  >
                    <button className='text-orange-500'>
                      <TrashIcon />
                    </button>
                  </deleteFetcher.Form>
                ) : (
                  <deleteFetcher.Form
                    method='post'
                    action={`/expenses/${item.id}/delete`}
                  >
                    <button className='text-orange-500'>
                      <TrashIcon />
                    </button>
                  </deleteFetcher.Form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
