import { Link, Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { clearStoredAuth, getAuthedUsername, isAuthed } from '../../lib/auth';

const AdminLayout = () => {
  const navigate = useNavigate()
  const username = getAuthedUsername()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16 sm:py-0">
            {/* 小屏：第一行仅 logo+系统名；sm+：与下方同一行 */}
            <Link to="/admin/staffs" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-800">星灿AI质检系统</div>
            </Link>

            {/* 小屏：第二行左导航右用户；sm+：与 logo 同行 */}
            <div className="flex items-center justify-between sm:flex-1 sm:ml-8">
              <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
                <Link to="/admin/staffs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  员工
                </Link>
                <Link to="/admin/groups" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  分组
                </Link>
                <Link to="/admin/reports" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  报告
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                {username ? (
                  <div className="text-sm font-medium text-gray-500">{username}</div>
                ) : null}
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                  onClick={() => {
                    clearStoredAuth()
                    navigate({ to: '/login', replace: true, search: { redirect: undefined } })
                  }}
                >
                  退出
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
};

export const Route = createFileRoute('/admin')({
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
