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
  { path: '/auth',      element: <Auth /> },
  { path: '/2fa/setup', element: <RequireAuth><Setup2FA/></RequireAuth> },
  { path: '/2fa/verify', element: <Verify2FA/> },

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
