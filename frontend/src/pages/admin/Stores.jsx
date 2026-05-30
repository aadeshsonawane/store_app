import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function Stores() {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' })
  const [error, setError] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const navigate = useNavigate()

  const fetchStores = () => {
    api.get('/admin/stores', { params: filters }).then(res => setStores(res.data))
  }

  useEffect(() => { fetchStores() }, [])

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    const sorted = [...stores].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setStores(sorted)
  }

  const handleAddStore = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/stores', form)
      setForm({ name: '', email: '', address: '', owner_id: '' })
      fetchStores()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Manage Stores</h2>
        <button onClick={() => navigate('/admin/dashboard')}>Back</button>
      </div>

  
      <h3>Add Store</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddStore} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder='Store Name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder='Address' value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
        <input placeholder='Owner ID' value={form.owner_id} onChange={e => setForm({ ...form, owner_id: e.target.value })} />
        <button type='submit'>Add</button>
      </form>

  
      <h3>Filter Stores</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder='Name' value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder='Email' value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder='Address' value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <button onClick={fetchStores}>Search</button>
      </div>

    
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', padding: '10px' }}>Name ↕</th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', padding: '10px' }}>Email ↕</th>
            <th style={{ padding: '10px' }}>Address</th>
            <th style={{ padding: '10px' }}>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{store.name}</td>
              <td style={{ padding: '10px' }}>{store.email}</td>
              <td style={{ padding: '10px' }}>{store.address}</td>
              <td style={{ padding: '10px' }}>{store.avgRating || 'No ratings'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Stores