import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getCurrentUser } from '../api/client'

export default function NewsList() {
  const [news, setNews] = useState([])
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const nav = useNavigate()
  const pageSize = 6

  useEffect(() => {
    api.get(`/news?page=${page}&size=${pageSize}`)
      .then(res => {
        setNews(res.data.news)
        setTotalPages(res.data.totalPages)
      })
      .catch(console.error)

    getCurrentUser().then(setUser).catch(console.error)
  }, [page])

  return (
    <div className="max-w-3xl mx-auto">
      <ul className="space-y-4">
        {news.map(n => (
          <li key={n.id} className="border p-4 rounded hover:shadow-sm">
            <Link to={`/news/${n.id}`} className="text-lg font-semibold">
              {n.title}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(n.time).toLocaleString()} by {n.author}
            </p>
            {user?.username === n.author && (
              <div className="mt-2 space-x-3">
                <button
                  onClick={() => nav(`/news/${n.id}/edit`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    api.delete(`/news/${n.id}`)
                      .then(() => api.get(`/news?page=${page}&size=${pageSize}`)
                        .then(r => {
                          setNews(r.data.news)
                          setTotalPages(r.data.totalPages)
                        }))
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className={`px-4 py-2 rounded ${
            page === 0 ? 'bg-gray-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          ← Prev
        </button>
        <span className="text-sm">
          Page {page + 1} of {totalPages || '?'}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 rounded ${
            page >= totalPages - 1
              ? 'bg-gray-200'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
