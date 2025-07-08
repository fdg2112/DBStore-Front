import { GoogleLogin } from '@react-oauth/google'
import { useUser } from '../context/UserContext'

export default function LoginPage() {
  const { login } = useUser()
  return (
    <div>
      <h2>Login</h2>
      <GoogleLogin onSuccess={cred => login(cred)} onError={() => {}} />
    </div>
  )
}
