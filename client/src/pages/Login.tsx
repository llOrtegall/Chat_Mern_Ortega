import { useState } from "react"
import axios from "axios"
import { useAuth } from "../auth/AuthProvider";
import { toast, Toaster } from "sonner";

const URL_LOGIN = import.meta.env.VITE_URL_LOGIN!;

export default function Login() {
  const [names, setNames] = useState('')
  const [lastNames, setLastNames] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [password, setPassword] = useState('')
  const [logiRegister, setLoginRegister] = useState('login')

  const { login } = useAuth();

  const handleLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();

    axios.post(`${URL_LOGIN}/login`, { email, password })
      .then(response => {
        console.log(response.data);
        login(response.data);
      })
      .catch(err => {
        console.log(err);
        if(err.response.status === 401){
          toast.error(err.response.data.message, { 
            description: 'Error al iniciar Sesión'
          })
        }
      })

  }

  const handleRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();

    axios.post(`${URL_LOGIN}/register`, { names, lastNames, email, password, confirmPassword: confirmPass })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleLoginRegister = () => {
    if (logiRegister === 'login') {
      setLoginRegister('register')
    } else {
      setLoginRegister('login')
    }
  }

  return (
    <section className="flex flex-col space-y-2 items-center justify-center min-h-screen bg-gray-100">
      {
        logiRegister === 'login' ?
          (
            <form className="flex flex-col p-6 bg-white rounded-lg shadow-lg gap-4 w-96" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">email</label>
                <input type="email" name="email" id="email" required value={email} onChange={ev => setEmail(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" id="password" required value={password} onChange={ev => setPassword(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
            </form>
          ) : (
            <form className="flex flex-col p-6 bg-white rounded-lg shadow-lg gap-4 w-96" onSubmit={handleRegister}>
              <div>
                <label htmlFor="names" className="block text-sm font-medium text-gray-700">names</label>
                <input type="names" name="names" id="names" required value={names} onChange={ev => setNames(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="lastNames" className="block text-sm font-medium text-gray-700">lastNames</label>
                <input type="lastNames" name="lastNames" id="lastNames" required value={lastNames} onChange={ev => setLastNames(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">email</label>
                <input type="email" name="email" id="email" required value={email} onChange={ev => setEmail(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" id="password" required value={password} onChange={ev => setPassword(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">confirm password</label>
                <input type="password" name="confirmPass" id="confirmPass" required value={confirmPass} onChange={ev => setConfirmPass(ev.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Register</button>
            </form>
          )
      }
      {
        logiRegister === 'login' ? (
          <label>No tienes cuenta ? <button onClick={handleLoginRegister}>Registrate</button></label>
        ) : (
          <label>Ya tienes cuenta ? <button onClick={handleLoginRegister}>Login</button></label>
        )
      }

      <Toaster position="top-right" visibleToasts={4} duration={4000} richColors/>
    </section>
  )
}