import {
  EyeClosedIcon,
  EyeOpenIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  TrashIcon
} from '@radix-ui/react-icons'
import {
  NavLink,
  Outlet,
  useFetcher,
  useRouteLoaderData
} from '@remix-run/react'
import dayjs from 'dayjs'
import React from 'react'
import type { Categories, Expense, Income } from '~/types/types'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
export type ItemCardProps = {
  data: Expense[] | Income[]
  type: 'income' | 'expense'
}

export type ItemCardOtherProps = {
  type: 'income' | 'expense'
}
export default function ItemCard({ data, type }: ItemCardProps) {
  // determine the type of category to use

  // use the type to determine the path or what route to submit data to
  const path = type === 'expense' ? '/expenses' : '/incomes'

  // set up the fetchers
  const deleteFetcher = useFetcher()

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      {data.map((item) => (
        <>
          <div
            key={item.id}
            className='flex w-[350px] flex-col items-center justify-center rounded-lg border-2 pb-2 shadow-lg '
          >
            <div className='flex w-full flex-col justify-between gap-2 p-2'>
              <div className='flex flex-row justify-between gap-1'>
                <p className='text-lg font-semibold'>{item.source}</p>
                <p className='text-lg italic'>${item.amount}</p>
              </div>

              <div className='flex items-center gap-1'></div>
              <div className='flex items-center justify-between gap-1  '>
                <p className='text-xs italic'>
                  {dayjs(item.dueDate).utcOffset(10).format('YYYY-MM-DD')}
                </p>
                {item.categories.map((category, index) => (
                  <NavLink
                    to={`${path}/categories/${category.id}`}
                    className='text-xs italic '
                    key={index}
                  >
                    {category.title.split(',')}
                  </NavLink>
                ))}
                <div className='flex items-center gap-2'>
                  {/* <button
                      className='text-blue-500'
                      onClick={() => setEdit(!edit)}
                    >
                      <Pencil1Icon className='h-[24px]' />
                    </button> */}
                  <NavLink to={`${path}/${item.id}/edit`}>
                    <Pencil1Icon className='h-[24px]' />
                  </NavLink>
                  {path && (
                    <deleteFetcher.Form
                      method='post'
                      action={`${path}/${item.id}/delete`}
                      className='w-[15px]'
                    >
                      <button className='text-orange-500'>
                        <TrashIcon />
                      </button>
                    </deleteFetcher.Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}
