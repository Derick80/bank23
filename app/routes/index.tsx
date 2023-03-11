import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'
import React from 'react'
import { BandChart, BandContainer } from '~/compoonents/bandchart'
import NewCard from '~/compoonents/create-card'
import ItemCard from '~/compoonents/item-card'
import NavBar from '~/compoonents/nav'
import Tooltip from '~/compoonents/tooltip'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getCurrentExpenses } from '~/server/expense.server'
import { categoriesAndPercentage } from '~/server/functions.server'
import { getCurrentIncomes } from '~/server/incomes.server'
import type { BandContainerObjectProps, CorrectedIncome } from '~/types/types'

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  const incomes = await getCurrentIncomes(user.id)
  const expenses = await getCurrentExpenses(user.id)

  // map over the incomes to return the new object

  const limitedIncome = incomes.map((income) => {
    return {
      amount: income.amount,
      category: income.categories.map((category) => category.title).toString()
    }
  })

  // reduce the categories to a string and then map over the expenses to return the new object
  const limitedExpenses = expenses.map((expense) => {
    return {
      amount: expense.amount,
      category: expense.categories.map((category) => category.title).toString()
    }
  })

  // Set up expenses and Icome by category and percentage for band chart

  const eByCandP = categoriesAndPercentage(limitedExpenses)
  console.log(eByCandP, 'eByCandP')

  const iByCandP = categoriesAndPercentage(limitedIncome)
  console.log(iByCandP, 'iByCandP')
  console.log(Array.isArray(eByCandP))

  return json({ incomes, expenses, eByCandP, iByCandP })
}

export default function Index() {
  const data = useLoaderData<{
    incomes: CorrectedIncome
    expenses: CorrectedIncome
    eByCandP: BandContainerObjectProps[]
    iByCandP: BandContainerObjectProps[]
  }>()

  const [makeNew, setMakeNew] = React.useState(true)
  const iSubTotal = data.incomes.reduce(
    (acc: number, income: { amount: number }) => acc + income.amount,
    0
  )
  const eSubTotal = data.expenses.reduce(
    (acc: number, expense: { amount: number }) => acc + expense.amount,
    0
  )

  return (
    <div className='flex flex-col py-2 text-center'>
      <NavBar />
      {/* Container */}
      <div className='flex w-full grow flex-col justify-center gap-5 md:flex-row'>
        <div className='flex flex-col items-center border-2  py-2 text-center'>
          <h1 className='text-4xl font-bold'>Expenses</h1>
          <button
            className='flex items-center gap-2'
            onClick={() => setMakeNew(!makeNew)}
          >
            {' '}
            <Tooltip message='Create'>
              <p>New</p>
              <PlusCircledIcon />
            </Tooltip>
          </button>
          {makeNew && <NewCard type='expense' />}{' '}
          <div className='text-xl italic'>${eSubTotal}</div>
          <ItemCard data={data.expenses} type='expense' />
          <div className='flex flex-col items-center   py-2 text-center'>
            <h3 className='text-2xl font-bold'>
              Expenses by Category and Percentage
            </h3>
            <BandContainer>
              {data.eByCandP.map((item) => {
                return (
                  <BandChart
                    key={item.category}
                    {...item}
                    bgFill={item.fills}
                    itemWidth={item.percentage}
                  />
                )
              })}
            </BandContainer>
          </div>
        </div>

        {/* incomes */}
        <div className='flex flex-col items-center border-2  py-2 text-center'>
          <h1 className='text-4xl font-bold'>Incomes</h1>
          <NavLink to='/new' className='flex items-center gap-2'>
            <p>New</p>
            <PlusCircledIcon />
          </NavLink>
          <div className='text-xl italic'>${iSubTotal}</div>
          <ItemCard data={data.incomes} type='income' />
          <div className='flex flex-col items-center   py-2 text-center'>
            <h3 className='text-2xl font-bold'>
              Expenses by Category and Percentage
            </h3>
            <BandContainer>
              {data.iByCandP.map((item: BandContainerObjectProps) => {
                return (
                  <BandChart
                    key={item.category}
                    {...item}
                    category={item.category}
                    bgFill={item.fills}
                    itemWidth={item.percentage}
                  />
                )
              })}
            </BandContainer>
          </div>
        </div>
      </div>

      <details>
        <summary>Expenses</summary>
        <MinusCircledIcon />

        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
      <hr />
      <details>
        <summary>Incomes</summary>
        <div>
          <PlusCircledIcon />
        </div>
        <pre>{JSON.stringify(data.incomes, null, 2)}</pre>
      </details>
    </div>
  )
}
