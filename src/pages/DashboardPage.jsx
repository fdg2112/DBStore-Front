import { useUser } from '../context/UserContext'

export default function DashboardPage() {
  const { user } = useUser()
  return (
    <div>
      <h2>Mi cuenta</h2>
      {user ? <pre>{JSON.stringify(user)}</pre> : <p>No logueado</p>}
    </div>
  )
}
