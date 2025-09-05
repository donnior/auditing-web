import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

const AdminLayout = () => (
  <div className="flex flex-col">
    <header className="flex justify-start items-center bg-slate-600 text-white p-4">
      <Link to="/" className="mr-4">
        <div className="text-2xl font-bold">Home</div>
      </Link>
      <Link to="/projects" className="mr-4">
        <div className="text-2xl font-bold">Projects</div>
      </Link>
    </header>
    <div className="flex flex-col gap-4 p-4">
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/_user')({
  component: AdminLayout,
});
