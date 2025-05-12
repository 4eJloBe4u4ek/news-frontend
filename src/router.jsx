// src/router.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Auth       from './pages/Auth'
import Setup2FA   from './pages/Setup2FA'
import Verify2FA  from './pages/Verify2FA'
import RoleSelect from './pages/RoleSelect'
import App        from './App'
import NewsList   from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import EditNews   from './pages/EditNews'
import Profile    from './pages/ProfileEdit'
import CreateNews from './pages/CreateNews'

const router = createBrowserRouter([
  // unauthenticated entry
  { path: '/auth',      element: <Auth /> },
  // after login with need2fa → go here
  { path: '/2fa/setup', element: <RequireAuth><Setup2FA/></RequireAuth> },
  // after scanning QR or coming from oauth redirect with need2fa → go here
  { path: '/2fa/verify', element: <Verify2FA/> },

  // everything else is behind your normal auth guard
  {
    path: '/',
    element: <RequireAuth><App/></RequireAuth>,
    children: [
      { index:      true,          element: <NewsList/> },
      { path:       'news/new',    element: <CreateNews/> },
      { path:       'news/:id',    element: <NewsDetail/> },
      { path:       'news/:id/edit', element: <EditNews/> },
      { path:       'profile',     element: <Profile/> },
      { path:       'set-role',    element: <RoleSelect/> },
    ]
  }
])

export function AppRouter() {
  return <RouterProvider router={router}/>
}
