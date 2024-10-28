import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    axios.post('/register', { username, email, password })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err))
  }

  return (
    <section className='h-screen w-full bg-gray-200'>
      <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-2xl font-bold mb-4'>Register</h1>
        <form className='flex flex-col space-y-1 w-1/3' onSubmit={handleSubmit}>
          <input value={username} onChange={e => setUsername(e.target.value)}
            type='text' placeholder='Username' className='p-2 border border-gray-300 rounded' />
          <input value={email} onChange={e => setEmail(e.target.value)}
            type='email' placeholder='Email' className='p-2 border border-gray-300 rounded' />
          <input value={password} onChange={e => setPassword(e.target.value)}
            type='password' placeholder='Password' className='p-2 border border-gray-300 rounded' />
          <button className='bg-blue-600 text-white p-2 rounded' type='submit'>Register</button>
        </form>
      </div>
    </section>
  )
}