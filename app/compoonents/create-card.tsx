import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useFetcher, useRouteLoaderData } from '@remix-run/react'
import CategoryCreator from './category-creater'

export default function NewCard({ type }: { type: 'income' | 'expense' }) {
  const { eCategories,iCategories } = useRouteLoaderData('root') as {
    eCategories: { id: number; title: string; type: string }[]
    iCategories: { id: number; title: string; type: string }[]
    user: { id: number; email: string }
  }

  const newFetcher = useFetcher()

  return (
    <>
      <newFetcher.Form
        method='post'
        action={`/new`}
        id='new'
        className='flex w-full flex-col space-y-2 rounded-md p-4 text-black shadow-md'
      >
        <label
          className='place-self-start text-xs font-bold text-black dark:text-slate-50'
          htmlFor='source'
        >
          Source
        </label>
        <input
          className='rounded-md border shadow-sm text-black'
          type='text'
          name='source'
        />
        <label
          className='place-self-start text-xs font-bold text-black dark:text-slate-50'
          htmlFor='amount'
        >
          Amount
        </label>
        <input
          className='rounded-md border shadow-sm text-black'
          type='number'
          name='amount'
        />
        <label
          className='place-self-start text-xs font-bold text-black dark:text-slate-50'
          htmlFor='dueDate'
        >
          Due Date
        </label>
        <input
          className='rounded-md border shadow-sm text-black'
          type='date'
          name='dueDate'
        />
        <label
          className='place-self-start text-xs font-bold text-black dark:text-slate-50'
          htmlFor='type'
        >
          Type
        </label>
        <div className='flex flex-row space-x-2'>
          <label
            className='place-self-start text-xs font-bold text-black dark:text-slate-50'
            htmlFor='expense'
          >
            Expense
          </label>
          <input
            className='rounded-md border shadow-sm text-black'
            type='radio'
            name='type'
            value='expense'
          />
          <label
            className='place-self-start text-xs font-bold text-black dark:text-slate-50'
            htmlFor='income'
          >
            Income
          </label>
          <input
            className='rounded-md border shadow-sm text-black'
            type='radio'
            name='type'
            value='income'
          />
        </div>

        <select
          className='rounded-md border shadow-sm text-black'
          name='category'
          id='category'
        >
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
          <button className='text-orange-500'>
            <PaperPlaneIcon />
          </button>
        </div>
      </newFetcher.Form>
      <details className='flex flex-col space-y-2'>
        <summary className='text-xs font-bold text-black dark:text-slate-50'>
          Create New Category
        </summary>
        <CategoryCreator />
      </details>
    </>
  )
}
