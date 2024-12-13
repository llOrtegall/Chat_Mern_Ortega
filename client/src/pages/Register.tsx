import { useUserContext } from '@/context/UserContext'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { toast, Toaster } from 'sonner'
import { useState } from 'react'
import axios from 'axios'

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
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        if (error.response?.status === 404) {
          toast.error('Error on try login', { description: error.response.data })
        } else if (error.response?.status === 401) {
          toast.error('Error on try login', { description: error.response.data })
        } else {
          toast.error('Error on try login', { description: 'Error on server' })
        }
      }
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
    <>
      <div className="relative h-screen w-full bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
          <main className='flex flex-col items-center justify-center h-full  z-20'>

            <form className='flex flex-col gap-2 w-1/5' onSubmit={handleSubmit}>
              <Label className='font-semibold' htmlFor='username'>Username</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)}
                type='text' placeholder='JhonDoe07' required />
              {
                isLoggingIn === 'register' && (
                  <>
                    <Label className='font-semibold' htmlFor='email'>Email</Label>
                    <Input value={email} onChange={e => setEmail(e.target.value)}
                      type='email' placeholder='useremail@example.com' />
                  </>
                )
              }
              <Label className='font-semibold' htmlFor='password'>Password</Label>
              <Input value={password} onChange={e => setPassword(e.target.value)}
                type='password' placeholder='*********' required />
              <Button type='submit' variant='secondary'>
                {
                  isLoggingIn === 'login' ? 'Login' : 'Register'
                }
              </Button>
            </form>

            <button onClick={() => setIsLoggingIn(isLoggingIn === 'login' ? 'register' : 'login')}
              className='mt-4 dark:text-white font-semibold dark:hover:text-yellow-200'>
              <span className='px-2'>
                {
                  isLoggingIn === 'login' ? 'Don\'t have an account ? -' : 'Already have an account ? -'
                }
              </span>
              <span>
                {
                  isLoggingIn === 'login' ? 'Register' : 'Login'
                }
              </span>
            </button>
          </main>

        </div>
      </div>

      <Toaster richColors duration={4000} position='top-right' visibleToasts={3} />
    </>
  )
}