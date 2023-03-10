import { MinusCircledIcon, Pencil2Icon, PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons'
import { json, LoaderArgs, redirect } from '@remix-run/node'
import { Form, NavLink, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import { isAuthenticated } from '~/server/auth/auth.server'
import { dateRange } from '~/server/functions.server'
import { prisma } from '~/server/prisma.server'

export async function loader({request}:LoaderArgs){
const user = await isAuthenticated(request)
if(!user){
  return redirect('/login')
}
const {now, then} = dateRange()
console.log(now, then);


const expenses = await prisma.expense.findMany({
  where:{
    userId: user.id,
    dueDate:{
      gte: now,
      lte: then
    }
  },
  include:{
    expenseCategory: true
  }
})

const incomes = await prisma.income.findMany({
  where:{
    userId: user.id,
    dueDate:{
      gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    }
  },
  include:{
    incomeCategory: true
  }
})


  return json({expenses, incomes})
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
const eSubTotal = data.expenses.reduce((acc, expense) => acc + expense.amount, 0)
const iSubTotal = data.incomes.reduce((acc, income) => acc + income.amount, 0)
  const [open, setOpen] = React.useState(false)

  const deleteFetcher = useFetcher()



  return (
   <div
    className='flex flex-col py-2 text-center'
   >
    {/* Container */}
    <div className='flex flex-col md:flex-row grow gap-5 justify-center w-full'>
      {/* expenses */}
<div className='flex flex-col items-center border-2  py-2 text-center'>
<h1 className='text-4xl font-bold'>Expenses</h1>
<NavLink to='/new'>
  New Expense
</NavLink>
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
    {data.expenses.map((expense) => (
      <tr key={expense.id}>
        <td className='border px-4 py-2'>{expense.source}</td>
        <td className='border px-4 py-2'>{expense.expenseCategory.map((
          category => category.title
        ))}</td>
        <td className='border px-4 py-2'>{format(new Date(expense.dueDate), "MMM yy")}</td>
        <td className='border px-4 py-2'>{expense.amount}</td>
        <td className='border px-4 py-2'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Edit
          </button>
        </td>

      </tr>
    ))}
  </tbody>
</table>
  </div>
{/* incomes */}
  <div className='flex flex-col items-center border-2  py-2 text-center'>
<h1 className='text-4xl font-bold'>Incomes</h1>
<NavLink to='/new'
  className='flex items-center gap-2'
>
<p>New</p>
<PlusCircledIcon />
</NavLink>
<div
  className='text-xl italic'
>
  ${iSubTotal}
</div>
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
    {data.incomes.map((income) => (
      <tr key={income.id}>
        { open ? (<>
          <td className='border px-4 py-2'>
          <input type='text' name='source' id='source'
          defaultValue={income.source}
          />
        </td>
        </>):(<>
        <td className='border px-4 py-2'>{income.source}</td>
        </>

        )}
        <td className='border px-4 py-2'>{income.incomeCategory.map((
          category => category.title
        ))}</td>
        <td className='border px-4 py-2'>{format(new Date(income.dueDate), "MMM yy")}</td>
        <td className='border px-4 py-2'>{income.amount}</td>
        <td className='border px-4 py-2'>
         <NavLink to={`/incomes/${income.id}/edit`}>
         <button
            onClick={() => {
              setOpen(!open)
            }
            }
          className='text-blue-500'>
            <Pencil2Icon />
          </button>
          </NavLink>
          <deleteFetcher.Form method='post' action={`/incomes/${income.id}/delete`}>
            <button className='text-orange-500'>
             <TrashIcon
             />
            </button>
          </deleteFetcher.Form>

        </td>


      </tr>

    ))}

  </tbody>
</table>
  </div>
    </div>

<details>
  <summary>Expenses</summary>
  <MinusCircledIcon />

<pre>
{JSON.stringify(data.expenses, null, 2)}
</pre>
</details>
<hr />
<details>
  <summary>Incomes</summary>
  <div>
  <PlusCircledIcon />
</div>
<pre>
{JSON.stringify(data.incomes, null, 2)}
</pre>
</details>
   </div>
  );
}
