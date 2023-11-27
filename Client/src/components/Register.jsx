import axios from 'axios'
import { useContext, useState } from 'react'
import { UserContext } from '../UserContext'

export function Register () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)

  async function handleSubmit (ev) {
    ev.preventDefault()
    const { data } = await axios.post('/register', { username, password })
    setUser(data)
  }

  return (
    <section className="bg-blue-200 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input value={username}
          onChange={ev => setUsername(ev.target.value)}
          placeholder="Username" type="text"
          className="border block w-full rounded-md p-2 mb-2"/>
        <input value={password}
          onChange={ev => setPassword(ev.target.value)}
          placeholder="Password" type="password"
          className="border block w-full rounded-md p-2 mb-2"/>
        <button className="bg-blue-500 text-white block w-full p-2 rounded-md">Register</button>
      </form>
    </section>
  )
}
