import { json, LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { BandContainer, BandChart } from '~/compoonents/bandchart'
import ItemCard from '~/compoonents/item-card'
import { categoriesAndPercentage } from '~/server/functions.server'
import { prisma } from '~/server/prisma.server'
import { BandContainerObjectProps } from '~/types/types'

export async function loader({ request, params }: LoaderArgs) {
  const { to } = params as { to: string }
  const { from } = params as { from: string }
const month = dayjs().format('MMMM')

const year = new Date(to).getFullYear()
  const incomes = await prisma.income.findMany({
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
    const limitedIncome = incomes.map((income) => {
        return {
            amount: income.amount,
            category: income.categories.map((category) => category.title).toString()
        }
    })
    const iByCandP = categoriesAndPercentage(limitedIncome)


    const iSubTotal = incomes.reduce(
        (acc: number, income: { amount: number }) => acc + income.amount,
        0
    )
  return json({ incomes, iByCandP, iSubTotal, month, year })
}

export default function MonthExpRoute() {
  const data = useLoaderData()

  return <>
      <div className='flex flex-col items-center   py-2 text-center'>
          <h3 className='mb-5 text-2xl font-bold'>
              Incomes by Category and Percentage
              for
              { data.month } { data.year }
          </h3>
          <p className='mb-4 italic text-xl font-bold'>
              ${ data.iSubTotal }
          </p>
          <BandContainer>
              { data.iByCandP.map((item: BandContainerObjectProps) => {
                  return (
                      <BandChart
                          key={ item.category }
                          { ...item }
                          category={ item.category }
                          bgFill={ item.fills }
                          itemWidth={ item.percentage }
                      />
                  )
              }) }
          </BandContainer>
      </div>
      <ItemCard data={ data.incomes } type='income' />

  </>
}
