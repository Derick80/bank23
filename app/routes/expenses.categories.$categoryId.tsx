import { json, LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import ItemCard from '~/compoonents/item-card'
import { prisma } from '~/server/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
  const categoryId = Number(params.categoryId)
  if (!categoryId) {
    throw new Error('No category id provided')
  }

  const expenses = await prisma.expense.findMany({
    where: {
      categories: {
        some: {
          id: categoryId
        }
      }
    },
    include: {
      categories: true
    }
  })

  const itemByCategory = expenses.map((expense) => {
    return {
      id: expense.id,
      source: expense.source,
      amount: expense.amount,
      dueDate: expense.dueDate,
      categories: expense.categories.map((category) => {
        return {
          id: category.id,
          title: category.title
        }
      })
    }
  })

  return json({ itemByCategory })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const { itemByCategory } = data
  console.log(Array.isArray(itemByCategory))

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <h1>Expenses</h1>

      <ItemCard data={itemByCategory} type='expense' />

      <hr />
      <details>
        <summary>expenses</summary>
        <pre style={{ maxHeight: '200px', overflow: 'scroll' }}>
          {JSON.stringify(itemByCategory, null, 2)}
        </pre>
      </details>
    </div>
  )
}
