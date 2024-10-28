import { useState } from 'react'
import axios from 'axios'
import { useUserContext } from '../context/UserContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const [isLoggingIn, setIsLoggingIn] = useState('login')

  const { setUsername: setLoggedInUsername, setId } = useUserContext()

  const LoginFuntion = async () => {
    try {
      const res = await axios.post('/login', { username, password })
      setLoggedInUsername(res.data.username)
      setId(res.data.id)
    } catch (error) {
      console.error(error)
    }
  }

  const RegisterFuntion = async () => {
    try {
      const res = await axios.post('/register', { username, password, email })
      setLoggedInUsername(res.data.username)
      setId(res.data.id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isLoggingIn === 'login' ? await LoginFuntion() : await RegisterFuntion()
  }

  return (
    <section className='h-screen w-full bg-gray-200'>
      <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-2xl font-bold mb-4'>
          {
            isLoggingIn === 'login' ? 'Login' : 'Register'
          }
        </h1>
        <form className='flex flex-col space-y-1 w-1/3' onSubmit={handleSubmit}>
          <input value={username} onChange={e => setUsername(e.target.value)}
            type='text' placeholder='Username' className='p-2 border border-gray-300 rounded' />
          {
            isLoggingIn === 'register' && (
              <input value={email} onChange={e => setEmail(e.target.value)}
                type='email' placeholder='Email' className='p-2 border border-gray-300 rounded' />
            )
          }
          <input value={password} onChange={e => setPassword(e.target.value)}
            type='password' placeholder='Password' className='p-2 border border-gray-300 rounded' />
          <button className='bg-blue-600 text-white p-2 rounded' type='submit'>
            {
              isLoggingIn === 'login' ? 'Login' : 'Register'
            }
          </button>
        </form>

        <button onClick={() => setIsLoggingIn(isLoggingIn === 'login' ? 'register' : 'login')}
          className='mt-4'>
            <span className='px-2'>
              {
                isLoggingIn === 'login' ? 'Don\'t have an account?' : 'Already have an account?'
              }
            </span>
          {
            isLoggingIn === 'login' ? 'Register' : 'Login'
          }
        </button>
      </div>
    </section>
  )
}