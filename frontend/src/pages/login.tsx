import { useAuth } from "../hooks/useAuth"

export default function LoginPage() {
  const { login } = useAuth() 

  const handleLogin = () => {
    login()
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}