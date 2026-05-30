import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function Dashboard() {
  const [stores, setStores] = useState([])
  const [ratedUsers, setRatedUsers] = useState([])
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/store-owner/dashboard').then(res => setStores(res.data))
    api.get('/store-owner/rated-users').then(res => setRatedUsers(res.data))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Store Owner Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={() => navigate('/owner/password')}>Update Password</button>
    <button onClick={() => { logout(); navigate('/login') }}>Logout</button>
  </div>
      </div>

  
      <h3>My Stores</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }}>Store Name</th>
            <th style={{ padding: '10px' }}>Address</th>
            <th style={{ padding: '10px' }}>Avg Rating</th>
            <th style={{ padding: '10px' }}>Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{store.name}</td>
              <td style={{ padding: '10px' }}>{store.address}</td>
              <td style={{ padding: '10px' }}>{store.avgRating || 'No ratings'}</td>
              <td style={{ padding: '10px' }}>{store.totalRatings}</td>
            </tr>
          ))}
        </tbody>
      </table>

    
      <h3>Users Who Rated</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratedUsers.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.name}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>{user.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard