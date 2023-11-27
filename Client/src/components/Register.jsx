import { useState } from 'react'

export function Register () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <section className="bg-blue-200 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12">
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
