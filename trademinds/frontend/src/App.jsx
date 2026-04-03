import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import { AuthProvider, useAuth } from './context/AuthContext'

import { ThemeProvider } from './context/ThemeContext' // <-- Added



// Layout & Navigation

import Layout from './components/layout/Layout'



// Pages

import Landing from './pages/Landing'

import Login from './pages/Login'

import Register from './pages/Register'

import Dashboard from './pages/Dashboard'

import Tutor from './pages/Tutor'

import Marketplace from './pages/Marketplace'

import Finance from './pages/Finance'

import Profile from './pages/Profile'

import SkillDetail from './pages/SkillDetail'

import Settings from './pages/Settings' // <-- Added



// 1. Loading Screen Component (Themed)

function LoadingScreen() {

  return (

    <div style={{

      minHeight: '100vh',

      backgroundColor: 'var(--bg-main)', // Use variable

      display: 'flex',

      alignItems: 'center',

      justifyContent: 'center',

      flexDirection: 'column',

      gap: '20px',

      transition: 'background-color 0.3s ease'

    }}>

      <div style={{

        width: '40px', height: '40px',

        border: '3px solid var(--border-color)', // Use variable

        borderTopColor: 'var(--text-main)', // Use variable

        borderRadius: '50%',

        animation: 'spin 1s linear infinite'

      }} />

      <p style={{

        fontWeight: '800',

        letterSpacing: '-0.5px',

        fontFamily: 'sans-serif',

        color: 'var(--text-main)' // Use variable

      }}>TradeMinds</p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

    </div>

  )

}



// 2. Protected Route Wrapper

function ProtectedRoute({ children }) {

  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (!user) return <Navigate to="/login" replace />

  return children

}



// 3. AppRoutes Component

function AppRoutes() {

  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />



  return (

    <Routes>

      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />

      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />



      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />

      <Route path="/tutor" element={<ProtectedRoute><Layout><Tutor /></Layout></ProtectedRoute>} />

      <Route path="/marketplace" element={<ProtectedRoute><Layout><Marketplace /></Layout></ProtectedRoute>} />

      <Route path="/finance" element={<ProtectedRoute><Layout><Finance /></Layout></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} /> {/* Added Route */}

      <Route path="/skill/:id" element={<ProtectedRoute><Layout><SkillDetail /></Layout></ProtectedRoute>} />



      <Route path="*" element={<Navigate to="/" />} />

    </Routes>

  )

}



// 4. THE ONLY APP DECLARATION

export default function App() {

  return (

    <AuthProvider>

      <ThemeProvider> {/* Wrapped App in ThemeProvider */}

        <BrowserRouter>

          <AppRoutes />

          <Toaster position="top-right" />

        </BrowserRouter>

      </ThemeProvider>

    </AuthProvider>

  )

}