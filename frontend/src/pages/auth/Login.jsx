import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)

      if (res.data.user.role === 'admin') navigate('/admin/dashboard')
      else if (res.data.user.role === 'store_owner') navigate('/owner/dashboard')
      else navigate('/stores')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type='email' name='email' value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' name='password' value={form.password} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <button type='submit' style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
      <p>Don't have an account? <Link to='/register'>Register</Link></p>
    </div>
  )
}

export default Login