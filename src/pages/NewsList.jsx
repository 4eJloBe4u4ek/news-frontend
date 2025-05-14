import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { getCurrentUser } from '../api/client'

export default function NewsList() {
    const [news, setNews] = useState([])
    const [user, setUser] = useState(null)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [confirmDeleteNewsId, setConfirmDeleteNewsId] = useState(null)
    const nav = useNavigate()
    const pageSize = 6

    useEffect(() => {
        fetchPage()
        getCurrentUser().then(setUser).catch(console.error)
    }, [page])

    function fetchPage() {
        api.get(`/news?page=${page}&size=${pageSize}`)
            .then(res => {
                setNews(res.data.news)
                setTotalPages(res.data.totalPages)
            })
            .catch(console.error)
    }

    const requestDelete = id => {
        setConfirmDeleteNewsId(id)
    }

    const cancelDelete = () => {
        setConfirmDeleteNewsId(null)
    }

    const confirmDelete = async () => {
        try {
            await api.delete(`/news/${confirmDeleteNewsId}`)
            setConfirmDeleteNewsId(null)
            fetchPage()
        } catch (err) {
            console.error('Delete failed', err)
            setConfirmDeleteNewsId(null)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
                {news.map(n => (
                    <li
                        key={n.id}
                        onClick={() => nav(`/news/${n.id}`)}
                        className="cursor-pointer border p-4 rounded-md hover:shadow-sm transition"
                    >
                        <h3 className="text-lg font-semibold text-brand-500 break-words">
                            {n.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 break-words">
                            {new Date(n.time).toLocaleString()} — {n.authorName}
                        </p>

                        {user?.id === n.authorId && (
                            <div className="mt-2 space-x-3">
                                <button
                                    onClick={e => {
                                        e.stopPropagation()
                                        nav(`/news/${n.id}/edit`)
                                    }}
                                    className="text-blue-600 hover:underline rounded-lg px-2 py-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={e => {
                                        e.stopPropagation()
                                        requestDelete(n.id)
                                    }}
                                    className="text-red-600 hover:underline rounded-lg px-2 py-1"
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
                    className={`px-4 py-2 rounded-md ${
                        page === 0
                            ? 'bg-gray-200'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    } transition`}
                >
                    ← Prev
                </button>
                <span className="text-sm">Page {page + 1} of {totalPages || '?'}</span>
                <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className={`px-4 py-2 rounded-md ${
                        page >= totalPages - 1
                            ? 'bg-gray-200'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    } transition`}
                >
                    Next →
                </button>
            </div>

            {confirmDeleteNewsId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-4">
                        <p className="text-center">Are you sure you want to delete this news?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-200 text-red-800 px-4 py-2 rounded hover:bg-red-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
