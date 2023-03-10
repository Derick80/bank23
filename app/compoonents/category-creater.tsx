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
      <categoryFetcher.Form ref={formRef} method='post' action='/new-category'>
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' />
        <label htmlFor='type'>Expense Category</label>
        <input type='radio' name='type' value='expense' />
        <label htmlFor='type'>Income Category</label>
        <input type='radio' name='type' value='income' />
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
