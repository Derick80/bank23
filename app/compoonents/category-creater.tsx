import { useFetcher } from '@remix-run/react'
import React, { useEffect } from 'react'

export default function CategoryCreator() {
  const categoryFetcher = useFetcher()

  // removes input after update
  let formRef = React.useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (categoryFetcher.type === 'done') {
      formRef.current?.reset()
    }
  }, [categoryFetcher.type])
  // removes input after update
  return (
    <>
      <categoryFetcher.Form
        ref={formRef}
        method='post'
        action='/new-category'
        className='flex w-full flex-col space-y-2 rounded-md p-4 text-black shadow-md'
      >
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          name='title'
          className='rounded-md border text-black shadow-sm'
        />
        <div className='flex flex-row space-x-2'>
          <label htmlFor='type'>Expense Category</label>
          <input type='radio' name='type' value='expense' />
          <label htmlFor='type'>Income Category</label>
          <input type='radio' name='type' value='income' />
        </div>
        <button type='submit'>Submit</button>
      </categoryFetcher.Form>
      {categoryFetcher.data && (
        <pre className='text-xs'>
          {JSON.stringify(categoryFetcher.data, null, 2)}
        </pre>
      )}
    </>
  )
}
