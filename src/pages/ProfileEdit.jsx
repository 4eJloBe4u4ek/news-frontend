import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function ProfileEdit() {
  const { user, setUser } = useContext(AuthContext)
  const [form, setForm]   = useState({ username: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        phone: user.phone || ''
      })
    }
  }, [user])

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validatePhone = phone =>
    /^\+\d{7,15}$/.test(phone)
	
	const validateUsername = username => /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9 _]{2,}$/.test(username)

  const save = async () => {
    const { username, email, phone } = form

    if (!username.trim() || !email.trim()) {
      setError('Username and email are required.')
      return
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.')
      return
    }
    if (phone && !validatePhone(phone)) {
      setError('Phone must start + and be 7–15 digits.')
      return
    }
	if (!validateUsername(username)) {
      setError('Username must 3+ chars, start with letter.')
      return
    }

    setError('')
    try {
      const { data } = await api.put('/auth/me', form)
      setUser(data)
      nav('/')
    } catch (e) {
      console.error(e)
      setError('Failed to save profile.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 space-y-4">
      <h2 className="text-xl font-bold">Edit Profile</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <label className="block">
        Username
        <input
          className="w-full border p-2 rounded mt-1"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
        />
      </label>

      <label className="block">
        Email
        <input
          className="w-full border p-2 rounded mt-1"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </label>

      <label className="block">
        Phone
        <input
          className="w-full border p-2 rounded mt-1"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
      </label>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => nav('/')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="px-4 py-2 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}