import chroma from 'chroma-js'


export function dateRange() {
  let currentMonth = new Date().getMonth()
  const year: number = new Date().getFullYear()
  const start = new Date(year, currentMonth)
  const startEdit = start.setUTCHours(0, 0, 0, 0)
  const now = new Date(startEdit)
  const then = new Date(year, currentMonth + 1, 0)
  return { now, then }
}

export  function categoriesAndPercentage(
  array: {
    amount: number
    category: string
  }[],
): Array<{ category: string; amount: number; percentage: number,
  fills: string }
>
 {


  const data = array
    .reduce(
      (
        acc: {category: string; amount: number,}[

        ],
        singleton: {  amount: number; category: string }
      ) => {
        const index = acc.findIndex((item: {
          category: string
          amount: number
        }) => item.category === singleton.category)
        if (index === -1) {
          return [...acc, singleton]
        } else {
          acc[index].amount += singleton.amount
          return acc
        }
      },
      []
    )

    const total = data.reduce((acc, item) => {
      return acc + item.amount
    }, 0)

       const moreData: { category: string; amount: number; percentage: number, fills:string }[] = []
    const percentage = data.map((item) => {
      const percent = (item.amount / total) * 100

      return Number(percent.toFixed(2))
    }
    )


    data.forEach((item, index) => {
      moreData.push({category: item.category, amount: item.amount, percentage: percentage[index],
      fills: chroma.scale(['orange','yellow','blue']).colors(percentage.length)[index]

    })
    }
    )
    return moreData

}