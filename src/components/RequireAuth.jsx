// src/components/RequireAuth.jsx
import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function RequireAuth({ children }) {
  const { token } = useContext(AuthContext)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }
  return children
}
