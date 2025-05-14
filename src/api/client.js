import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const api = axios.create({ baseURL: apiBase })

api.interceptors.request.use(cfg => {
    const token = sessionStorage.getItem('token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})

api.interceptors.response.use(
    r => r,
    err => {
        const status = err.response?.status
        const url    = err.config?.url || ''

        if (
            status === 401 &&
            !url.endsWith('/auth/login') &&
            !url.endsWith('/auth/register') &&
            !url.endsWith('/auth/2fa/setup') &&
            !url.endsWith('/auth/2fa/verify')
        ) {
            window.location.href = '/auth'
        }
        return Promise.reject(err)
    }
)

export async function getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data
}

export default api
