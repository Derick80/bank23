import { IncomeCategory, ExpenseCategory } from '@prisma/client'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useFetcher, useRouteLoaderData } from '@remix-run/react'
import React from 'react'
import CategoryCreator from './category-creater'




export default function NewCard({type}: {type: 'income' | 'expense'}){
    const {iCategories,eCategories} = useRouteLoaderData('root') as {
        iCategories: IncomeCategory[]
        eCategories: ExpenseCategory[]
        user: { id: number; email: string }
      }
    const newFetcher = useFetcher()




    return (
        <>
<newFetcher.Form
        method='post'
        action={`/new`}
        id='new'
        className='flex w-full flex-col space-y-2 rounded-md p-4 shadow-md text-black'
      >
        <label className='place-self-start text-xs font-bold text-black dark:text-slate-50' htmlFor='source'>
          Source
        </label>
        <input
          className='rounded-md border shadow-sm'
          type='text'
          name='source'
        />
        <label className='text-xs font-bold text-black dark:text-slate-50 place-self-start' htmlFor='amount'>
          Amount
        </label>
        <input
          className='rounded-md border shadow-sm'
          type='number'
          name='amount'
        />
        <label className='text-xs font-bold text-black dark:text-slate-50 place-self-start' htmlFor='dueDate'>
          Due Date
        </label>
        <input
          className='rounded-md border shadow-sm'
          type='date'
          name='dueDate'
        />
        <label className='text-xs font-bold text-black dark:text-slate-50 place-self-start' htmlFor='type'>
          Type
        </label>
        <div className='flex flex-row space-x-2'>
          <label className='text-xs font-bold text-black dark:text-slate-50 place-self-start' htmlFor='expense'>
            Expense
          </label>
          <input
            className='rounded-md border shadow-sm'
            type='radio'
            name='type'
            value='expense'
          />
          <label className='text-xs font-bold text-black dark:text-slate-50 place-self-start' htmlFor='income'>
            Income
          </label>
          <input
            className='rounded-md border shadow-sm'
            type='radio'
            name='type'
            value='income'
          />
        </div>

        <select
        className='rounded-md border shadow-sm'
        name='category' id='category'>
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

        <div className='flex flex-row justify-center'>
        <button

className='text-orange-500'>
    <PaperPlaneIcon />
</button>
        </div>
      </newFetcher.Form>
      <details className='flex flex-col space-y-2'>
        <summary className='text-xs font-bold text-black dark:text-slate-50'>Create New Category</summary>
        <CategoryCreator />
        </details>
        </>
    )
}