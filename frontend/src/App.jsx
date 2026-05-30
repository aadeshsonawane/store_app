import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
 import 'bootstrap/dist/css/bootstrap.css';
   import "bootstrap/dist/js/bootstrap.bundle.min.js";
  //  import 'bootstrap-icons/font/bootstrap-icons.css';
  import AdminUserDetail from './pages/admin/UserDetail'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminStores from './pages/admin/Stores'

import UserStores from './pages/user/Stores'

import OwnerDashboard from './pages/storeOwner/Dashboard'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' />
  if (role && user.role !== role) return <Navigate to='/login' />
  return children
}

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/admin/dashboard' element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
      <Route path='/admin/users' element={<ProtectedRoute role='admin'><AdminUsers /></ProtectedRoute>} />
      <Route path='/admin/stores' element={<ProtectedRoute role='admin'><AdminStores /></ProtectedRoute>} />
      <Route path='/admin/users/:id' element={<ProtectedRoute role='admin'><AdminUserDetail /></ProtectedRoute>} />

      <Route path='/stores' element={<ProtectedRoute role='user'><UserStores /></ProtectedRoute>} />
      <Route path='/owner/dashboard' element={<ProtectedRoute role='store_owner'><OwnerDashboard /></ProtectedRoute>} />

      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default App