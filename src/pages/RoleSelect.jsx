import React, { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function RoleSelect() {
    const [role, setRole] = useState('SUBSCRIBER')
    const { setToken }    = useContext(AuthContext)
    const navigate        = useNavigate()

    const save = async () => {
        try {
            const resp = await api.post('/auth/set-role', { role })
            const { token, need2faSetup, need2faVerify } = resp.data

            setToken(token)

            if (need2faSetup) {
                navigate('/2fa/setup', { replace: true })
            }
            else if (need2faVerify) {
                navigate('/2fa/verify', { replace: true })
            }
            else {
                navigate('/', { replace: true })
            }
        } catch (e) {
            console.error('Cannot save role', e)
            alert('Error: ' + e.response?.status)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-4 border rounded space-y-4">
            <h2 className="text-xl font-bold">Select your role</h2>
            <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-2 border rounded"
            >
                <option value="SUBSCRIBER">Subscriber</option>
                <option value="JOURNALIST">Journalist</option>
            </select>
            <button
                onClick={save}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Save
            </button>
        </div>
    )
}
