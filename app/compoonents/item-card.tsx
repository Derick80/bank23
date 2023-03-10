import { ChevronDownIcon, ChevronUpIcon, DividerHorizontalIcon, Pencil1Icon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { useFetcher } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import { DTPropsExpense } from './display-data-table'

export default function ItemCard({ data, type }: DTPropsExpense) {
  const [edit, setEdit] = React.useState(false)
  const [showDetails, setShowDetails] = React.useState(true)
  const path = type === 'expense' ? '/expenses' : '/incomes'
  const deleteFetcher = useFetcher()

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
          <div className='flex w-full justify-between p-2 gap-2'>
            <div className='flex flex-col gap-1'>
              <p
              className='text-xs'
              >{item.source}</p>
            </div>

            <div className='flex items-center gap-1'>
              <p className='text-xs italic'>${item.amount}</p>
            </div>

          </div>
          {showDetails && (
            <div className='flex items-center w-full justify-around  p-2 gap-2'>

<div
    className='flex gap-1'>
        <p
    className='text-xs italic'>
        Due...
    </p>
    <p
    className='text-xs'
    >{format(new Date(item.dueDate), 'MMM yy')}</p>

</div>
{item.categories.map((category, index) => (
                <p
                className='text-xs italic rounded-2xl h-fit w-fit p-1'
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
          )}
          <hr className='w-3/4' />
            <div className='flex w-full justify-end gap-2 p-2'>
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>

              </div>
          </div>

      ))}
    </div>
  )
}
