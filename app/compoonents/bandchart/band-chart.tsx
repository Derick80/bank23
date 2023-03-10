export interface BandChartProps {
    bgFill: string
    itemWidth: number
    id: string
    percentage: number | string,
    category: string
  }

  export function BandChart({
    bgFill,
    itemWidth,
    id,
    category,
    percentage
  }: BandChartProps) {
    return (
      <span
        key={id}
        className='flex h-5 flex-row items-center justify-center border-r-2 font-semibold'
        style={{
          backgroundColor: `${bgFill}`,
          width: `${itemWidth}%`
        }}
      >
       <p className='translate-y-4 space-between flex text-[8px]'>{category} </p>
      </span>
    )
  }