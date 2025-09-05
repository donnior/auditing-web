import { createFileRoute } from '@tanstack/react-router'

// routes/slow-page.tsx
export const Route = createFileRoute('/admin/slow-page')({
  loader: () => new Promise(resolve => setTimeout(resolve, 3000)),

  pendingComponent: LoadingComponent,

  component: SlowPageComponent,
  pendingMs: 0,
});

function LoadingComponent() {
  // 你可以设计任何加载 UI，比如一个骨架屏
  return <div>Loading your very important data... Please wait!</div>;
}

function SlowPageComponent() {
  return <div>Hello "/slow-page"!</div>
}
