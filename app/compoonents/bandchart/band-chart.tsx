import Tooltip from '../tooltip'

export interface BandChartProps {
  bgFill: string
  // generated by chromajs scale
  itemWidth: number
  // percentage of total
  category: string
}

export function BandChart({ bgFill, itemWidth, category }: BandChartProps) {
  return (
    <span
      key={category}
      className='flex h-5 flex-row items-center justify-center font-semibold'
      style={{
        backgroundColor: `${bgFill}`,
        width: `${itemWidth}%`
      }}
    >
      {/* only display if 10% or greater */}

       <Tooltip message={category}>
         <p className='space-between flex translate-y-4 text-[8px]'>
          {category.slice(0,3)} {itemWidth}%{' '}
        </p>
        </Tooltip>

    </span>
  )
}
