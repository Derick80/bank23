import { Form, Link, NavLink } from '@remix-run/react'
import { useOptionalUser } from '~/utilities/hooks'

export default function NavBar({ children }: { children: React.ReactNode }) {
  const user = useOptionalUser()
  return (
    <div className='flex h-screen flex-col'>
      <nav className='flex h-16 w-full flex-row items-center justify-between bg-gray-500'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Budget Tracker</h1>
        </div>
        <div className='flex flex-row gap-2'>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='/expenses'>Expenses</NavLink>
          <NavLink to='/incomes'>Incomes</NavLink>
        </div>
        <div className='flex flex-row gap-2'>
          {user ? (
            <Form method='post' action='/logout'>
              <button type='submit'>Logout</button>
            </Form>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </div>
      </nav>
      {children}
    </div>
  )
}
