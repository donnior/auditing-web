import * as React from 'react'
import { Link, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react';

import { BProgress } from '@bprogress/core';
import '@bprogress/core/css';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });

  useEffect(() => {
    if (isLoading) {
      BProgress.start(); // 如果任何路由在加载中，启动进度条
    } else {
      BProgress.done(); // 加载完成，结束进度条
    }
  }, [isLoading]);


  return (
    <React.Fragment>
      {/* <div className="flex flex-col">
        <header className="flex justify-start items-center bg-slate-600 text-white p-4">
          <Link to="/" className="mr-4">
            <div className="text-2xl font-bold">Home</div>
          </Link>
          <Link to="/projects" className="mr-4">
            <div className="text-2xl font-bold">Projects</div>
          </Link>
          <Link to="/admin" className="mr-4">
            <div className="text-2xl font-bold">Admin</div>
          </Link>
        </header>
        <div className="flex flex-col gap-4 p-4">
          <Outlet />
        </div>
      </div> */}
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </React.Fragment>
  )
}
