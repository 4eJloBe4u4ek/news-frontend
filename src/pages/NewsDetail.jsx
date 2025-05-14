import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { AuthContext } from '../contexts/AuthContext'

export default function NewsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [news, setNews] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingError, setEditingError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const [notFound, setNotFound] = useState(false)
  const [deletedMessage, setDeletedMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      const [newsRes, commentsRes] = await Promise.all([
        api.get(`/news/${id}`),
        api.get(`/news/${id}/comments?page=0&size=50`)
      ])
      setNews(newsRes.data)
      setComments(commentsRes.data.comments)
      setNotFound(false)
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true)
        setDeletedMessage('Oops, this news has been deleted.')
      } else if (err.response?.status === 401) {
        navigate('/auth', { replace: true })
      } else {
        console.error(err)
      }
    }
  }

  const toggleLike = async commentId => {
    try {
      const c = comments.find(c => c.id === commentId)
      if (c.likedByMe) {
        await api.delete(`/news/${id}/comments/${commentId}/like`)
      } else {
        await api.post(`/news/${id}/comments/${commentId}/like`)
      }
      await fetchData()
    } catch (e) {
      console.error('Cannot toggle like', e)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty')
      return
    }
    setCommentError('')
    try {
      await api.post(`/news/${id}/comments`, { text: newComment })
      setNewComment('')
      fetchData()
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true)
        setDeletedMessage('Oops, this news has been deleted.')
      } else {
        console.error(err)
      }
    }
  }

  const saveEditedComment = async cid => {
    if (!editingText.trim()) {
      setEditingError('Edited text cannot be empty')
      return
    }
    setEditingError('')
    try {
      await api.put(`/news/${id}/comments/${cid}`, { text: editingText })
      setEditingCommentId(null)
      setEditingText('')
      fetchData()
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true)
        setDeletedMessage('Oops, this news has been deleted.')
      } else {
        console.error(err)
      }
    }
  }

  const deleteComment = async cid => {
    try {
      await api.delete(`/news/${id}/comments/${cid}`)
      setConfirmDeleteId(null)
      fetchData()
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true)
        setDeletedMessage('Oops, this news has been deleted.')
      } else {
        console.error(err)
      }
    }
  }

  if (notFound) {
    return (
        <div className="max-w-2xl mx-auto p-4">
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
            {deletedMessage}
          </div>
          <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
          >
            ← Back to all news
          </button>
        </div>
    )
  }

  if (!news) return <p className="text-center py-8">Loading…</p>

  return (
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <button
            onClick={() => navigate('/')}
            className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
        >
          ← Back to all news
        </button>

        <article>
          <h2 className="text-2xl font-bold mb-2 break-words">{news.title}</h2>
          <p className="text-gray-700 break-words">{news.text}</p>
        </article>

        <section>
          <h3 className="text-xl font-semibold mb-2">Comments</h3>

          {user?.role === 'SUBSCRIBER' && (
              <div className="mb-6">
                {commentError && (
                    <p className="text-red-600 text-sm mb-2">{commentError}</p>
                )}
                <textarea
                    className="w-full border rounded p-2 mb-2 min-h-[4rem]"
                    rows={3}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <button
                    onClick={addComment}
                    className="bg-green-200 text-green-800 px-4 py-2 rounded hover:bg-green-300"
                >
                  Post comment
                </button>
              </div>
          )}

          {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
          ) : (
              comments.map(c => (
                  <div key={c.id} className="border p-3 mb-4 rounded">
                    {editingCommentId === c.id ? (
                        <>
                          {editingError && (
                              <p className="text-red-600 text-sm mb-2">{editingError}</p>
                          )}
                          <textarea
                              className="w-full border rounded p-2 mb-2 min-h-[4rem]"
                              rows={2}
                              value={editingText}
                              onChange={e => setEditingText(e.target.value)}
                          />
                          <div className="flex space-x-2">
                            <button
                                onClick={() => saveEditedComment(c.id)}
                                className="bg-blue-200 text-blue-800 px-3 py-1 rounded hover:bg-blue-300"
                            >
                              Save
                            </button>
                            <button
                                onClick={() => {
                                  setEditingCommentId(null)
                                  setEditingError('')
                                }}
                                className="text-gray-600 px-3 py-1 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                    ) : (
                        <>
                          <p className="mb-1 break-words">{c.text}</p>
                          <p className="text-xs text-gray-500 mb-2 break-words">
                            {new Date(c.time).toLocaleString()} — {c.authorName}
                          </p>

                          <div className="flex space-x-4 text-sm items-center">
                            {user && (
                                <button
                                    onClick={() => toggleLike(c.id)}
                                    className="flex items-center space-x-1 focus:outline-none"
                                >
                                  <svg
                                      className={`w-5 h-5 ${
                                          c.likedByMe ? 'text-red-500' : 'text-gray-400'
                                      }`}
                                      fill={c.likedByMe ? 'currentColor' : 'none'}
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                  >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                                    2 5.42 4.42 3 7.5 3c1.74 0 3.41.81
                                    4.5 2.09C13.09 3.81 14.76 3 16.5 3
                                    19.58 3 22 5.42 22 8.5c0 3.78-3.4
                                    6.86-8.55 11.54L12 21.35z"/>
                                  </svg>
                                  <span>{c.likesCount}</span>
                                </button>
                            )}

                            {user?.id === c.authorId && (
                                <>
                                  <button
                                      onClick={() => {
                                        setEditingCommentId(c.id)
                                        setEditingText(c.text)
                                      }}
                                      className="text-blue-600 hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                      onClick={() => setConfirmDeleteId(c.id)}
                                      className="text-red-600 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </>
                            )}
                          </div>
                        </>
                    )}
                  </div>
              ))
          )}

          {confirmDeleteId !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <p className="mb-4 text-center">Delete this comment?</p>
                  <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => deleteComment(confirmDeleteId)}
                        className="bg-red-200 text-red-800 px-4 py-2 rounded hover:bg-red-300"
                    >
                      Delete
                    </button>
                    <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}
        </section>
      </div>
  )
}
