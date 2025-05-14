import React, { createContext, useState, useEffect } from 'react'
import api from '../api/client'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem('token'))
  const [user, setUser]   = useState({ id: null, username: null, role: null })

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
         .then(r => setUser(r.data))
         .catch(() => setUser(null))
    } else {
      sessionStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }, [token])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'token') {
        setToken(e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
