import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

const AdminLayout = () => (
  <div className="flex flex-col min-h-screen">
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/admin/staffs" className="flex items-center mr-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-800">
                客服审计系统
              </div>
            </Link>
          </div>
          <div className="text-sm text-gray-500">

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
);

export const Route = createFileRoute('/_auth')({
  component: AdminLayout,
});
