import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function Dashboard() {
  const [stats, setStats] = useState({})
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={() => { logout(); navigate('/login') }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', flex: 1 }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', flex: 1 }}>
          <h3>Total Stores</h3>
          <p style={{ fontSize: '2rem' }}>{stats.totalStores}</p>
        </div>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', flex: 1 }}>
          <h3>Total Ratings</h3>
          <p style={{ fontSize: '2rem' }}>{stats.totalRatings}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
        <button onClick={() => navigate('/admin/stores')}>Manage Stores</button>
      </div>
    </div>
  )
}

export default Dashboard