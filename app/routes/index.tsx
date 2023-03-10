import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'
import DataTable from '~/compoonents/display-data-table'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getCurrentIncomes } from '~/server/incomes.server'
import type { CorrectedIncome } from '~/types/types'

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  const incomes = await getCurrentIncomes(user.id)

  return json({ incomes })
}

export default function Index() {
  const data = useLoaderData<{ incomes: CorrectedIncome }>()

  const iSubTotal = data.incomes.reduce(
    (acc: number, income: { amount: number }) => acc + income.amount,
    0
  )

  return (
    <div className='flex flex-col py-2 text-center'>
      {/* Container */}
      <div className='flex w-full grow flex-col justify-center gap-5 md:flex-row'>
        <div className='flex flex-col items-center border-2  py-2 text-center'>
          <h1 className='text-4xl font-bold'>Expenses</h1>
          <NavLink to='/new' className='flex items-center gap-2'>
            <p>New</p>
            <PlusCircledIcon />
          </NavLink>
          <div className='text-xl italic'></div>
          {/* <DataTable data={data.expenses} category={data.expenses.map((item)=> item.expenseCategory)} type='expense' /> */}
        </div>

        {/* incomes */}
        <div className='flex flex-col items-center border-2  py-2 text-center'>
          <h1 className='text-4xl font-bold'>Incomes</h1>
          <NavLink to='/new' className='flex items-center gap-2'>
            <p>New</p>
            <PlusCircledIcon />
          </NavLink>
          <div className='text-xl italic'>${iSubTotal}</div>
          <DataTable data={data.incomes} type='income' />
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
