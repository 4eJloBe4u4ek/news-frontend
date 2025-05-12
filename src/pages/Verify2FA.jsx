import React, { useState, useEffect, useRef, useContext } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Verify2FA() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [code, setCode] = useState(Array(6).fill(''))
    const [error, setError] = useState(null)
    const inputsRef = useRef([])

    useEffect(() => {
        inputsRef.current[0]?.focus()
    }, [])

    const handleChange = (idx, val) => {
        if (!/^\d?$/.test(val)) return
        const newCode = [...code]
        newCode[idx] = val
        setCode(newCode)

        if (val && idx < 5) {
            inputsRef.current[idx + 1]?.focus()
        }

        if (newCode.every(ch => ch !== '')) {
            submit(newCode.join(''))
        }
    }

    const submit = async fullCode => {
        setError(null)
        try {
            const { data } = await api.post('/auth/2fa/verify', { code: fullCode })
            sessionStorage.setItem('token', data.token)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            navigate('/')
        } catch (e) {
            setError('Invalid code. Please try again.')
            setCode(Array(6).fill(''))
            inputsRef.current[0]?.focus()
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow text-center">
            <h2 className="text-xl font-bold mb-4">Enter your 2FA code</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="flex justify-between space-x-2">
                {code.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={el => (inputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(idx, e.target.value)}
                        className="w-12 h-12 text-center text-xl border rounded"
                    />
                ))}
            </div>
        </div>
    )
}
