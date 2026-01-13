import { Link, Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { clearStoredAuth, isAuthed } from '../../lib/auth';

const AdminLayout = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <header className="flex justify-start items-center bg-slate-600 text-white p-4">
        <Link to="/" className="mr-4">
          <div className="text-2xl font-bold">Home</div>
        </Link>
        <Link to="/projects" className="mr-4">
          <div className="text-2xl font-bold">Projects</div>
        </Link>
        <div className="flex-1" />
        <button
          type="button"
          className="text-sm text-white/90 hover:text-red-200 transition-colors"
          onClick={() => {
            clearStoredAuth()
            navigate({ to: '/login', replace: true, search: { redirect: undefined } })
          }}
        >
          退出登录
        </button>
      </header>
      <div className="flex flex-col gap-4 p-4">
        <Outlet />
      </div>
    </div>
  )
};

export const Route = createFileRoute('/_user')({
  component: AdminLayout,
  beforeLoad: ({ location }) => {
    if (!isAuthed()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
});
