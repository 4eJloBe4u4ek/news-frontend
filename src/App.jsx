import React, { useContext } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'

export default function App() {
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-50 border-r p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <Link
            to="/profile"
            className="block w-full text-center bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 transition"
          >
            Profile
          </Link>
          {user?.role === 'JOURNALIST' && (
            <button
              onClick={() => nav('/news/new')}
              className="w-full bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200 transition"
            >
              + Add News
            </button>
          )}
        </div>
        <button
          onClick={() => {
            logout()
            nav('/auth')
          }}
          className="w-full bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
