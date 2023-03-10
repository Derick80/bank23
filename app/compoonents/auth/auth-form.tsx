import { Form, useActionData, useSearchParams } from '@remix-run/react'

type Props = {
  authType: 'register' | 'login'
}

const actionMap: Record<Props['authType'], { button: string; url: string }> = {
  register: {
    url: '/register',
    button: 'Sign up'
  },
  login: {
    url: '/login',
    button: 'Log in'
  },
}

export const AuthForm = ({ authType }: Props) => {

  const action = useActionData()
  const [searchParams] = useSearchParams()
  const { button, url } = actionMap[authType]

  const token = searchParams.get('token')
  const redirectTo = searchParams.get('redirectTo')

  return (
    <Form
      className='mx-auto flex w-full flex-col items-center justify-center'
      method='post'
      action={url}
    >
      <input type='hidden' name='redirectTo' value={redirectTo || '/'} />
      <input type='hidden' name='token' value={token || ''} />


        <>
          <label className='text-sm text-zinc-900 dark:text-slate-200'>
            Email
          </label>
          <input
            className='rounded-xl p-2'
            id='email'
            name='email'
            type='email'
            placeholder='youremail@mail.com'
          />
          <label>Username</label>
          <input
            className='rounded-xl p-2'
            id='username'
            name='username'
            type='text'
            placeholder='username'
          />
        </>

      {authType === 'login' && (
        <>
          <label>Password</label>
          <input
            className='rounded-xl p-2'
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            placeholder='********'
          />
        </>
      )}

      <button  className='mt-5' type='submit'>
        {button}
      </button>
    </Form>
  )
}
