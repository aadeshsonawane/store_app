import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function Stores() {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: '', address: '' })
  const [error, setError] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const fetchStores = () => {
    api.get('/user/stores', { params: filters }).then(res => setStores(res.data))
  }

  useEffect(() => { fetchStores() }, [])

  const handleRating = async (storeId, rating) => {
    try {
      await api.post('/user/rating', { store_id: storeId, rating })
      fetchStores()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>All Stores</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={() => navigate('/user/password')}>Update Password</button>
    <button onClick={() => { logout(); navigate('/login') }}>Logout</button>
  </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

    
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input placeholder='Search by Name' value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder='Search by Address' value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <button onClick={fetchStores}>Search</button>
      </div>

    
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }}>Store Name</th>
            <th style={{ padding: '10px' }}>Address</th>
            <th style={{ padding: '10px' }}>Overall Rating</th>
            <th style={{ padding: '10px' }}>Your Rating</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{store.name}</td>
              <td style={{ padding: '10px' }}>{store.address}</td>
              <td style={{ padding: '10px' }}>{store.overallRating || 'No ratings'}</td>
              <td style={{ padding: '10px' }}>{store.userRating || 'Not rated'}</td>
              <td style={{ padding: '10px' }}>
                <select
                  defaultValue={store.userRating || ''}
                  onChange={e => handleRating(store.id, parseInt(e.target.value))}
                >
                  <option value='' disabled>Rate</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Stores