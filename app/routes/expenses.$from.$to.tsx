import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { BandContainer, BandChart } from '~/compoonents/bandchart'
import ItemCard from '~/compoonents/item-card'
import { categoriesAndPercentage } from '~/server/functions.server'
import { prisma } from '~/server/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
  const { to } = params as { to: string }
  const { from } = params as { from: string }
    const month:string = dayjs().format('MMMM')

    const year:number = new Date(to).getFullYear()
  const expenses = await prisma.expense.findMany({
    where: {
      dueDate: {
        gte: new Date(from),
        lte: new Date(to)
      }
    },
    include: {
      categories: true
    }
  })
    const limitedExpenses = expenses.map((expense) => {
        return {
            amount: expense.amount,
            category: expense.categories.map((category) => category.title).toString()
        }
    })
    const eByCandP = categoriesAndPercentage(limitedExpenses)
    const eSubTotal = expenses.reduce(
        (acc: number, expense: { amount: number }) => acc + expense.amount,
        0
    )
  return json({ expenses, eByCandP, eSubTotal, month, year })
}

export default function MonthExpRoute() {
  const data = useLoaderData<typeof loader>()


  return <>

      <div className='flex flex-col items-center   py-2 text-center'>
          <h3 className='mb-5 text-2xl font-bold'>
              Expenses by Category and Percentage
              for
             <p className='mb-4 italic text-xl font-bold'>
                  { data.month } { data.year }
                </p>
          </h3>
          <p className='mb-4 italic text-xl font-bold'>
                ${ data.eSubTotal }
            </p>
          <BandContainer>
              { data.eByCandP.map((item) => {
                  return (
                      <BandChart
                          key={ item.category }
                          { ...item }
                          bgFill={ item.fills }
                          itemWidth={ item.percentage }
                      />
                  )
              }) }
          </BandContainer>
          <ItemCard data={ data.expenses } type='expense' />
      </div>
  </>
}
