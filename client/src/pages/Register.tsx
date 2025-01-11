import { useUserContext } from '@/context/UserContext'
import { Toaster } from "@/components/ui/toaster"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const { toast } = useToast()

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
          toast({ title: 'Error on try login', description: error.response.data || 'User not found' })
        } else if (error.response?.status === 401) {
          toast({ title: 'Error on try login', description: error.response.data || 'User not found' })
        } else {
          toast({ title: 'Error on try login', description: 'Error on server' })
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
      <main className='h-screen w-screen flex flex-col items-center justify-center'>

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
          <Button type='submit'>
            {isLoggingIn === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>

        <button onClick={() => setIsLoggingIn(isLoggingIn === 'login' ? 'register' : 'login')}
          className='mt-4 dark:text-white font-semibold dark:hover:text-yellow-200'>
          <span className='px-2'>
            {isLoggingIn === 'login' ? 'Don\'t have an account ? -' : 'Already have an account ? -'}
          </span>
          <span>
            {isLoggingIn === 'login' ? 'Register' : 'Login'}
          </span>
        </button>
      </main>
      <Toaster />
    </>
  )
}