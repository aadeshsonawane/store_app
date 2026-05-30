import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function UserDetail() {
  const [user, setUser] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(res => setUser(res.data))
  }, [id])

  if (!user) return <p>Loading...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>User Detail</h2>
        <button onClick={() => navigate('/admin/users')}>Back</button>
      </div>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.role === 'store_owner' && (
          <p><strong>Avg Rating Given:</strong> {user.avgRating || 'N/A'}</p>
        )}
      </div>
    </div>
  )
}

export default UserDetail