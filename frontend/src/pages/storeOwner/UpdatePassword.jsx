import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function UpdatePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/store-owner/password', form)
      setSuccess('Password updated successfully!')
      setTimeout(() => navigate('/owner/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Update Password</h2>
        <button onClick={() => navigate('/owner/dashboard')}>Back</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Password</label>
          <input type='password' value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <div>
          <label>New Password</label>
          <input type='password' value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <button type='submit' style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Update</button>
      </form>
    </div>
  )
}

export default UpdatePassword
