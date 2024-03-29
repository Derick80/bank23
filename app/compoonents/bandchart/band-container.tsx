import type { ReactNode } from 'react'

export function BandContainer({ children }: { children: ReactNode }) {
  return (
    <div className='relative inline-flex h-5 w-[340px] bg-black dark:bg-white'>
      {children}
    </div>
  )
}
