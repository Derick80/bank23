import { Box, Container, Grid } from '@mantine/core'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import React from 'react'
import NavBar from './nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className='flex flex-col md:grid md:grid-cols-[250px_minmax(900px,_1fr)_100px]'>
      <LeftDrawer open={open} setOpen={setOpen} />
      <div className='flex h-full grow flex-col md:col-span-2'>{children}</div>
    </div>
  )
}

interface ILeftDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function LeftDrawer(props: ILeftDrawerProps) {
  const { open, setOpen } = props

  return (
    <div className='flex h-[100px] text-black  md:col-span-1 md:h-full'>
      <NavBar />
    </div>
  )
}
