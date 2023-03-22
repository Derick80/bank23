import { Flex, Navbar, Text } from '@mantine/core'
import { DatePicker, MonthPicker } from '@mantine/dates'
import {
  ExitIcon,
  HomeIcon,
  MinusIcon,
  PlusCircledIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import { Form, Link, NavLink, useFetcher } from '@remix-run/react'
import React from 'react'
import { useOptionalUser } from '~/utilities/hooks'

export default function NavBar({ children }: { children?: React.ReactNode }) {
  const user = useOptionalUser()
  return (
    <Navbar color='dark' className='flex flex-col items-center'>
      <Navbar.Section>
        <div>
          <h1 className='text-2xl font-bold'>Budget Tracker</h1>
        </div>
      </Navbar.Section>
      <div className='flex flex-row gap-2 md:flex-col'>
        <NavLink className='flex items-center gap-2' to='/'>
          <Text>Home</Text>
          <HomeIcon />
        </NavLink>
        <Navbar.Section>
          <NavLink className='flex items-center gap-2' to='/expenses'>
            <Text>Expenses</Text>
            <MinusIcon />
          </NavLink>
          <div className='mx-auto hidden w-1/2 flex-col items-center py-2  text-center md:flex'>
            <GetDataByMonthRange type='expenses' />
          </div>
        </Navbar.Section>
        <Navbar.Section>
          <NavLink className='flex items-center gap-2' to='/incomes'>
            <Text>Incomes</Text>
            <PlusIcon />
          </NavLink>
          <div className='mx-auto hidden w-1/2 flex-col items-center py-2  text-center md:flex'>
            <GetDataByMonthRange type='incomes' />
          </div>
        </Navbar.Section>
        <Navbar.Section grow>
          <NavLink className='flex items-center gap-2' to='/new'>
            <Text>New</Text>
            <PlusCircledIcon />
          </NavLink>
        </Navbar.Section>
        <Navbar.Section>
          {user ? (
            <Form method='post' action='/logout'>
              <button className='flex items-center gap-2' type='submit'>
                <Text>Logout</Text>
                <ExitIcon />
              </button>
            </Form>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </Navbar.Section>
      </div>
    </Navbar>
  )
}

function GetDataByMonthRange({ type }: { type: string }) {
  const getterFetcher = useFetcher()

  const [month, setMonth] = React.useState<Date | null>(null)
  console.log(month, 'month')

  const from = new Date(month)
  console.log(from, 'from')
  const year = from.getFullYear()
  console.log(year, 'year')

  let numberMonth = month?.getMonth()
  console.log(numberMonth, 'numberMonth')

  const to = new Date(year, numberMonth + 1, 0)
  console.log(to, 'to')
  console.log(getterFetcher.data, 'getterFetcher.data')

  return (
    <details>
      <Form
        method='get'
        className='text-black'
        action={`/${type}/${from}/${to}`}
      >
        <MonthPicker size='xs' value={month} onChange={setMonth} />

        <button type='submit'>Submit</button>
      </Form>

      {getterFetcher.data && getterFetcher.data?.length}
    </details>
  )
}
