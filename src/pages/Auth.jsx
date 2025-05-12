import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { AuthContext } from '../contexts/AuthContext'
import googleLogo from '../assets/google.png'

// валидация
const usernameRe    = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9 _]{2,}$/
const emailRe       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRe    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
const validatePhone = phone => /^\+\d{7,15}$/.test(phone)

export default function Auth() {
  const [qs]       = useSearchParams()
  const navigate   = useNavigate()
  const location   = useLocation()
  const { setToken } = useContext(AuthContext)

  // Обрабатываем редирект с ?token=...&need2faSetup=...&need2faVerify=...
  useEffect(() => {
    const token         = qs.get('token')
    const roleMissing   = qs.get('roleMissing')   === 'true'
    const need2faSetup  = qs.get('need2faSetup')  === 'true'
    const need2faVerify = qs.get('need2faVerify') === 'true'

    if (token) {
      setToken(token)
      if (roleMissing) {
        navigate('/set-role', { replace: true })
      }
      else if (need2faSetup) {
        navigate('/2fa/setup', { replace: true })
      }
      else if (need2faVerify) {
        navigate('/2fa/verify', { replace: true })
      }
      else {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      }
    }
  }, [])

  // чтобы не показывать форму, пока query-параметры еще корректно не распарсились
  if (qs.get('token')) return null

  const [mode, setMode]   = useState('login')
  const [form, setForm]   = useState({ username:'', email:'', password:'', phone:'' })
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!emailRe.test(form.email))       errs.email    = 'Invalid email'
    if (!passwordRe.test(form.password))  errs.password = 'Min 8 chars, upper, lower & digit'
    if (mode==='signup') {
      if (!usernameRe.test(form.username)) errs.username = '3+ chars, start with letter'
      if (form.phone && !validatePhone(form.phone)) errs.phone = 'Phone must start “+” and have 7–15 digits'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    try {
      // При регистрации сначала регистрируемся
      if (mode === 'signup') {
        await api.post('/auth/register', {
          username: form.username,
          email:    form.email,
          password: form.password,
          phone:    form.phone,
          role:     'UNASSIGNED'
        })
      }

      // А потом — всегда логинимся
      const resp = await api.post('/auth/login', {
        email:    form.email,
        password: form.password
      })

      const { token, roleMissing, need2faSetup, need2faVerify } = resp.data
      setToken(token)

      if (roleMissing) {
        navigate('/set-role', { replace: true })
      }
      else if (need2faSetup) {
        navigate('/2fa/setup', { replace: true })
      }
      else if (need2faVerify) {
        navigate('/2fa/verify', { replace: true })
      }
      else {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      }
    } catch {
      setError(
          mode === 'login'
              ? 'Invalid email or password'
              : 'Sign up failed. Please check your data.'
      )
    }
  }

  return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
        {/* переключатель режимов */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
              onClick={() => { setMode('login');  setFieldErrors({}); setError(null) }}
              className={mode==='login' ? 'font-bold text-blue-600' : 'text-gray-500'}
          >Log In</button>
          <button
              onClick={() => { setMode('signup'); setFieldErrors({}); setError(null) }}
              className={mode==='signup' ? 'font-bold text-blue-600' : 'text-gray-500'}
          >Sign Up</button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={submit} noValidate className="space-y-4">
          {mode==='signup' && (
              <div>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                />
                {fieldErrors.username && <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>}
              </div>
          )}
          <div>
            <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            {fieldErrors.password && <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>}
          </div>
          {mode==='signup' && (
              <div>
                <input
                    type="text"
                    placeholder="Phone (e.g. +1234567890)"
                    className="w-full p-2 border rounded"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
                {fieldErrors.phone && <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>}
              </div>
          )}
          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {mode==='login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {mode==='login' && (
            <div className="mt-6">
              <a
                  href="http://localhost:8080/oauth2/authorization/google"
                  className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-50"
              >
                <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
                <span>Log In with Google</span>
              </a>
            </div>
        )}
      </div>
  )
}
