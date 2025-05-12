import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function CreateNews() {
  const { user } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [text, setText]   = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  if (user?.role !== 'JOURNALIST') {
    return <p className="p-4">Only journalists can post.</p>
  }

  const save = async () => {
    if (!title.trim() || !text.trim()) {
      setError('Both title and body must be non-empty.')
      return
    }
    setError('')
    try {
      const { data } = await api.post('/news', { title, text })
      nav(`/news/${data.id}`)
    } catch (e) {
      console.error(e)
      setError('Failed to publish. Try again.')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 space-y-4">
      <h2 className="text-2xl font-bold">New Article</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Body"
        value={text}
        onChange={e => setText(e.target.value)}
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
          className="px-4 py-2 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition"
        >
          Publish
        </button>
      </div>
    </div>
  )
}
