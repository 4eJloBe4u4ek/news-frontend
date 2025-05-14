import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import api from '../api/client'

export default function EditNews() {
    const {id} = useParams()
    const nav = useNavigate()
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        api.get(`/news/${id}`)
            .then(r => {
                setTitle(r.data.title)
                setText(r.data.text)
            })
            .catch(console.error)
    }, [id])

    const save = async () => {
        if (!title.trim() || !text.trim()) {
            setError('Both title and body must be non-empty.')
            return
        }
        setError('')
        try {
            await api.put(`/news/${id}`, {title, text})
            nav('/')
        } catch (e) {
            console.error(e)
            setError('Failed to save. Try again.')
        }
    }

    return (
        <div className="max-w-lg mx-auto mt-16 p-4 border rounded space-y-4 min-w-[20rem]">
            <h2 className="text-xl font-bold">Edit News</h2>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <input
                className="w-full p-2 border rounded min-w-full"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
            />

            <textarea
                className="w-full p-2 border rounded min-w-full min-h-[12rem]"
                rows={6}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Body"
            />

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
                    Save
                </button>
            </div>
        </div>
    )
}
