import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PublicView from './pages/PublicView'
import PrivateRoute from './components/PrivateRoute'
import AdminDashboard from './pages/AdminDashboard'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/view/:userId" element={<PublicView />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  )
}
export default App
