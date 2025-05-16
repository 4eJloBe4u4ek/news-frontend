import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import api, { apiBase } from '../api/client'
import { AuthContext } from '../contexts/AuthContext'
import googleLogo from '../assets/google.png'
import {
    usernameRe, emailRe, passwordRe, phoneRe,
    errorMessages
} from '../utils/validation'

export default function Auth() {
    const [qs]      = useSearchParams()
    const navigate  = useNavigate()
    const location  = useLocation()
    const { setToken } = useContext(AuthContext)

    useEffect(() => {
        const token        = qs.get('token')
        const roleMissing  = qs.get('roleMissing') === 'true'
        const need2faSetup = qs.get('need2faSetup') === 'true'
        const need2faVerify= qs.get('need2faVerify') === 'true'

        if (token) {
            setToken(token)
            if (roleMissing) {
                navigate('/set-role', { replace: true })
            } else if (need2faSetup) {
                navigate('/2fa/setup', { replace: true })
            } else if (need2faVerify) {
                navigate('/2fa/verify', { replace: true })
            } else {
                const from = location.state?.from?.pathname || '/'
                navigate(from, { replace: true })
            }
        }
    }, [])

    if (qs.get('token')) {
        return null
    }

    const [mode, setMode]          = useState('login')
    const [form, setForm]          = useState({ username: '', email: '', password: '', phone: '' })
    const [error, setError]        = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (mode === 'signup' && !usernameRe.test(form.username)) errs.username = errorMessages.username
        if (!emailRe.test(form.email))                         errs.email    = errorMessages.email
        if (!passwordRe.test(form.password))                   errs.password = errorMessages.password
        if (mode === 'signup' && form.phone && !phoneRe.test(form.phone)) errs.phone = errorMessages.phone

        setFieldErrors(errs)
        return Object.keys(errs).length === 0
    }

    const submit = async e => {
        e.preventDefault()
        setError(null)
        if (!validate()) return

        try {
            if (mode === 'signup') {
                await api.post('/auth/register', {
                    username: form.username,
                    email:    form.email,
                    password: form.password,
                    phone:    form.phone,
                    role:     'UNASSIGNED'
                })
            }

            const resp = await api.post('/auth/login', {
                email:    form.email,
                password: form.password
            })

            const { token, roleMissing, need2faSetup, need2faVerify } = resp.data
            setToken(token)
            if (roleMissing) {
                navigate('/set-role', { replace: true })
            } else if (need2faSetup) {
                navigate('/2fa/setup', { replace: true })
            } else if (need2faVerify) {
                navigate('/2fa/verify', { replace: true })
            } else {
                const from = location.state?.from?.pathname || '/'
                navigate(from, { replace: true })
            }
        } catch (e) {
            if (mode === 'signup' && e.response?.status === 409) {
                setError('That email is already registered. Please choose another one.')
            } else {
                setError(
                    mode === 'login'
                        ? 'Invalid email or password.'
                        : 'Sign up failed. Please double-check all fields.'
                )
            }
        }
    }

    const oauth2Url = `${apiBase}/oauth2/authorization/google`

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    onClick={() => { setMode('login');  setFieldErrors({}); setError(null) }}
                    className={mode === 'login' ? 'font-bold text-blue-600' : 'text-gray-500'}
                >
                    Log In
                </button>
                <button
                    onClick={() => { setMode('signup'); setFieldErrors({}); setError(null) }}
                    className={mode === 'signup' ? 'font-bold text-blue-600' : 'text-gray-500'}
                >
                    Sign Up
                </button>
            </div>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={submit} noValidate className="space-y-4">
                {mode === 'signup' && (
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-2 border rounded"
                            value={form.username}
                            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        />
                        {fieldErrors.username && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>
                        )}
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
                    {fieldErrors.email && (
                        <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    />
                    {fieldErrors.password && (
                        <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                    )}
                </div>
                {mode === 'signup' && (
                    <div>
                        <input
                            type="text"
                            placeholder="Phone (e.g. +1234567890)"
                            className="w-full p-2 border rounded"
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        />
                        {fieldErrors.phone && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                        )}
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {mode === 'login' ? 'Log In' : 'Create Account'}
                </button>
            </form>

            {mode === 'login' && (
                <div className="mt-6">
                    <a
                        href={oauth2Url}
                        className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-50"
                    >
                        <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2"/>
                        <span>Log In with Google</span>
                    </a>
                </div>
            )}
        </div>
    )
}
