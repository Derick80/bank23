export interface BandChartProps {
    bgFill: string
    itemWidth: number
    id: string
    percentage: number | string
  }

  export function BandChart({
    bgFill,
    itemWidth,
    id,
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
      ></span>
    )
  }