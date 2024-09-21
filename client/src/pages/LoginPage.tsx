import { useUser } from '../context/UserContext'
import { useState } from 'react'
import axios from 'axios'

function LoginPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUsername: setLoggedInUsername, setId } = useUser()

  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const URL = isLoginOrRegister === 'register' ? 'register' : 'login'

    axios.post(`/${URL}`, { username, password })
      .then(res => {
        if (res.status === 201) {
          setId(res.data.id)
          setLoggedInUsername(username)
        }
        if (res.status === 400) {
          throw new Error('Registration failed')
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="bg-blue-200 h-screen flex items-center">
      <form className="w-72 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text" placeholder="username" value={username}
          className="block p-2 w-full rounded-md mb-2 border"
          onChange={e => setUsername(e.target.value)} />

        <input
          type="password" placeholder="password" value={password}
          className="block p-2 w-full rounded-md mb-2 border"
          onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white block w-full p-2">
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className='text-center'>
          {
            isLoginOrRegister === 'register' && (
              <div>
                <span>Ya Estás Registrado ?</span>
                <button className='text-blue-900 font-medium pl-2' onClick={() => setIsLoginOrRegister('login')}>
                  Ingresa Aquí
                </button>
              </div>
            )
          }
          {
            isLoginOrRegister === 'login' && (
              <div>
                <span>No estas registrado ?</span>
                <button className='text-blue-900 font-medium pl-2' onClick={() => setIsLoginOrRegister('register')}>
                  Registro Aquí
                </button>
              </div>
            )
          }

        </div>
      </form>
    </div>
  )
}

export default LoginPage
