import type { IncomeCategory, ExpenseCategory } from '@prisma/client'
import { PaperPlaneIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useFetcher, useRouteLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import type { DTPropsExpense } from './display-data-table'

export default function ItemCard({ data, type }: DTPropsExpense) {
    const {iCategories,eCategories} = useRouteLoaderData('root') as {
        iCategories: IncomeCategory[]
        eCategories: ExpenseCategory[]
        user: { id: number; email: string }
      }
const selected = type === 'expense' ? eCategories : iCategories
  const [edit, setEdit] = React.useState(false)
  const path = type === 'expense' ? '/expenses' : '/incomes'
  const deleteFetcher = useFetcher()
const editFetcher = useFetcher()
console.log(path, 'path');

  return (
    <div
    className='flex flex-col w-full gap-2'
    >
      {data.map((item) => (
        <div
          key={item.id}
          className='flex w-full flex-col items-center justify-center rounded-lg shadow-lg border-2 pb-2'
        >
{edit ? (
    <>                <editFetcher.Form method='post' action={`${path}/${item.id}/edit`} className='text-black'>
                   <div
                    className='flex w-full justify-between p-2 gap-2'>
                        <div className='flex flex-col'>
                        <label htmlFor='source'
                        className='text-xs font-bold text-black dark:text-slate-50'
                        >Source</label>
                         <input
                        type='text'
                        name='source'
                        defaultValue={item.source}
                        className='border-2 border-gray-300 rounded-md p-1'
                    />
                    </div>
                    <div className='flex flex-col'>
                    <label htmlFor='amount'
                        className='text-xs font-bold text-black dark:text-slate-50'
                        >Amount</label>
                    <input
                        type='number'
                        name='amount'
                        defaultValue={item.amount}
                        className='border-2 border-gray-300 rounded-md p-1'
                    />
                    </div>
                    </div>
        <div className='flex w-full justify-between p-2 gap-2'>
        <div className='flex flex-col'>
                    <label htmlFor='dueDate'
                        className='text-xs font-bold text-black dark:text-slate-50'
                        >Due Date</label>

        <input
                        type='date'
                        name='dueDate'
                        defaultValue={format(new Date(item.dueDate), 'yyyy-MM-dd')}
                        className='border-2 border-gray-300 rounded-md p-1'
                    />
</div>
                    {item.categories && (
        <div className='flex flex-col'>
        <label htmlFor='categories'
                        className='text-xs font-bold text-black dark:text-slate-50'
                        >Categories</label>
                          <select
            name='category'
            id='category'
            className='rounded-md border p-2 text-black shadow-sm'
          >
            {selected.map((category) => {
              return (
                <option
                  key={category.id}
                  selected={category.title === item.categories[0].title}

                >
                  {category.title}
                </option>
              )
            })}
          </select>
        </div>
        )}
        </div>
                    <button

                    className='text-orange-500'>
                        <PaperPlaneIcon />
                    </button>


                </editFetcher.Form>
                <div className='flex items-center gap-2'>
                <button
                  className='text-blue-500'
                  onClick={() => setEdit(!edit)}
                >

                  <Pencil1Icon className='h-[24px]' />
                </button>
                {path && (
                  <deleteFetcher.Form
                    method='post'
                    action={`${path}/${item.id}/delete`}
                    className='w-[15px]'
                  >
                    <button

                    className='text-orange-500'>
                      <TrashIcon />
                    </button>
                  </deleteFetcher.Form>
                )}
              </div>
                </>

                ) :(
                    <div className='flex flex-col w-full justify-between p-2 gap-2'>
            <div className='flex flex-row justify-between gap-1'>
              <p
              className='text-lg font-semibold'
              >{item.source}</p>
                            <p className='text-lg italic'>${item.amount}</p>

            </div>

            <div className='flex items-center gap-1'>
            </div>
            <div
    className='flex gap-1 items-center justify-between  '>

    <p
    className='text-xs italic'
    >Due...{format(new Date(item.dueDate), 'MMM yy')}</p>
{item.categories.map((category, index) => (
                <p
                className='text-xs italic '
                key={index}>{category.title.split(',')}</p>
              ))}
              <div className='flex items-center gap-2'>
                <button
                  className='text-blue-500'
                  onClick={() => setEdit(!edit)}
                >

                  <Pencil1Icon className='h-[24px]' />
                </button>
                {path && (
                  <deleteFetcher.Form
                    method='post'
                    action={`${path}/${item.id}/delete`}
                    className='w-[15px]'
                  >
                    <button

                    className='text-orange-500'>
                      <TrashIcon />
                    </button>
                  </deleteFetcher.Form>
                )}
              </div>
</div>

          </div>
                )

}


          </div>

      ))}
    </div>
  )
}
