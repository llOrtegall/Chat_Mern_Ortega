import { useState } from 'react'
import { Toaster } from 'sonner'
import axios from 'axios'
import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'


function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setIsAuthenticated } = useUser()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios.post('/login', { email, password })
      .then(res => {
        if (res.status === 201) {
          setIsAuthenticated(true)
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <section className='w-screen h-screen flex flex-col items-center justify-center pb-12'>
      <form className='w-full px-64' onSubmit={handleSubmit}>
        <div className='relative z-0 w-full mb-5 group'>
          <input type='email' placeholder=' ' required value={email} onChange={e => setEmail(e.target.value)}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer' />
          <label className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Email address</label>
        </div>
        <div className='relative z-0 w-full mb-5 group'>
          <input type='password' placeholder=' ' required value={password} onChange={e => setPassword(e.target.value)}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer' />
          <label className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Password</label>
        </div>
        <button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Log In</button>
      </form>

      <p className='text-center mt-5 text-sm text-gray-500 dark:text-gray-400'>No estas registrado?
        <Link to='/register' className='px-2 hover:underline'>
          Register
        </Link>
      </p>

      <Toaster duration={4000} position='top-right' richColors />
    </section>
  )
}

export default LoginPage
