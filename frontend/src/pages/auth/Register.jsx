import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20-60 characters'
    if (form.address.length > 400) return 'Address max 400 characters'
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) return 'Password: 8-16 chars, 1 uppercase, 1 special character'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    try {
      await api.post('/auth/register', form)
      setSuccess('Registered successfully! Please login.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type='text' name='name' value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <div>
          <label>Email</label>
          <input type='email' name='email' value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <div>
          <label>Address</label>
          <input type='text' name='address' value={form.address} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' name='password' value={form.password} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0' }} />
        </div>
        <button type='submit' style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Register</button>
      </form>
      <p>Already have an account? <Link to='/login'>Login</Link></p>
    </div>
  )
}

export default Register