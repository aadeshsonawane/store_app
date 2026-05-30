import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function Users() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' })
  const [error, setError] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const navigate = useNavigate()

  const fetchUsers = () => {
    api.get('/admin/users', { params: filters }).then(res => setUsers(res.data))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    const sorted = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setUsers(sorted)
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/users', form)
      setForm({ name: '', email: '', password: '', address: '', role: 'user' })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Manage Users</h2>
        <button onClick={() => navigate('/admin/dashboard')}>Back</button>
      </div>

      {/* Add User Form */}
      <h3>Add User</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder='Name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder='Password' type='password' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <input placeholder='Address' value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
          <option value='store_owner'>Store Owner</option>
        </select>
        <button type='submit'>Add</button>
      </form>

      {/* Filters */}
      <h3>Filter Users</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder='Name' value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder='Email' value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder='Address' value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
          <option value=''>All Roles</option>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
          <option value='store_owner'>Store Owner</option>
        </select>
        <button onClick={fetchUsers}>Search</button>
      </div>

      {/* Users Table */}
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', padding: '10px' }}>Name ↕</th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', padding: '10px' }}>Email ↕</th>
            <th style={{ padding: '10px' }}>Address</th>
            <th onClick={() => handleSort('role')} style={{ cursor: 'pointer', padding: '10px' }}>Role ↕</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.name}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>{user.address}</td>
              <td style={{ padding: '10px' }}>{user.role}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => navigate(`/admin/users/${user.id}`)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users