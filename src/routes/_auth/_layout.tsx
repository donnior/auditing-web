import { Outlet, createFileRoute } from '@tanstack/react-router';

const AdminLayout = () => (
  <div className="flex flex-col">
    <header className="flex justify-start items-center bg-slate-600 text-white p-4">
        <div className="text-2xl font-bold">Logo</div>
    </header>
    <div className="flex flex-col gap-4 p-4">
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/_auth')({
  component: AdminLayout,
});
