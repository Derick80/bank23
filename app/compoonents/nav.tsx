import { Form, Link } from '@remix-run/react'
import { useOptionalUser } from '~/utilities/hooks'

export default function NavBar() {
  const user = useOptionalUser()
  return (
    <nav className='flex h-16 w-full flex-row items-center justify-between bg-gray-500'>
      <div>
        <h1 className='text-2xl font-bold text-white'>Budget Tracker</h1>
      </div>
      <div className='flex flex-row gap-2'>menus</div>
      <div className='flex flex-row gap-2'>
              { user ? (
                  <Form method='post' action='/logout'>
                      <button type='submit'>Logout</button>
                  </Form>
              ) : (
                  <Link to='/login'>Login</Link>
              ) }
      </div>
    </nav>
  )
}
