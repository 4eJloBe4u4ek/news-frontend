import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../contexts/AuthContext'
import api from '../api/client'
import {useNavigate} from 'react-router-dom'

import {emailRe, errorMessages, phoneRe, usernameRe} from '../utils/validation'

export default function ProfileEdit() {
    const {user, setUser} = useContext(AuthContext)
    const [form, setForm] = useState({username: '', email: '', phone: ''})
    const [fieldErrors, setFieldErrors] = useState({})
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

    const validate = () => {
        const errs = {}
        if (!usernameRe.test(form.username)) errs.username = errorMessages.username
        if (!emailRe.test(form.email)) errs.email = errorMessages.email
        if (form.phone && !phoneRe.test(form.phone)) errs.phone = errorMessages.phone

        setFieldErrors(errs)
        return Object.keys(errs).length === 0
    }

    const save = async () => {
        setError('')
        if (!validate()) return

        try {
            const {data} = await api.put('/auth/me', form)
            setUser(data)
            nav('/')
        } catch (e) {
            console.error(e)
            if (e.response?.status === 409) {
                setError('This email is already in use by another account.')
            } else {
                console.error(e)
                setError('Failed to save profile. Please try again later.')
            }
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-4 space-y-4">
            <h2 className="text-xl font-bold">Edit Profile</h2>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <label className="block">
                Username
                <input
                    className="w-full border p-2 rounded mt-1"
                    value={form.username}
                    onChange={e => setForm(f => ({...f, username: e.target.value}))}
                />
                {fieldErrors.username && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>
                )}
            </label>

            <label className="block">
                Email
                <input
                    className="w-full border p-2 rounded mt-1"
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                />
                {fieldErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                )}
            </label>

            <label className="block">
                Phone
                <input
                    className="w-full border p-2 rounded mt-1"
                    value={form.phone}
                    onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                />
                {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                )}
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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}
