import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Setup2FA() {
    const [qr, setQr] = useState(null)
    const nav = useNavigate()

    useEffect(() => {
        api.get('/auth/me')
            .then(({ data }) => {
                if (data.totpSecret) {
                    nav('/2fa/verify', { replace: true })
                } else {
                    return api.post('/auth/2fa/setup')
                }
            })
            .then(resp => {
                if (resp) setQr(resp.data.qrCodeBase64)
            })
            .catch(() => {
                alert('Failed to fetch 2FA setup')
                nav('/')
            })
    }, [])

    if (!qr) return <p>Loading 2FA setup…</p>
    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow text-center">
            <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
            <p className="mb-4">Scan this QR code with an Authenticator app:</p>
            <img src={`data:image/png;base64,${qr}`} alt="2FA QR Code" className="mx-auto mb-6"/>
            <button
                onClick={() => nav('/2fa/verify')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Verify Code
            </button>
        </div>
    )
}
