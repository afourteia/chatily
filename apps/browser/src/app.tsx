import { useSessionStorage } from '@/hooks/use-session-storage';
import { Spinner } from '@/components/ui/spinner';
import { routeTree } from '@/routeTree.gen';
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query-client';
import { useStore } from '@/store/use-store';
import { useShallow } from 'zustand/react/shallow';
import.meta.env.MODE;

declare const __BUILD_TIMESTAMP__: string;
console.log('build time:', __BUILD_TIMESTAMP__ || 'unknown');
// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }: { error: Error }) => <ErrorComponent error={error} />,
  context: {
    queryClient,
    store: undefined!,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  console.log('App mode:', import.meta.env.MODE);
  // This stuff is just to tweak our sandbox setup in real-time
  const [loaderDelay, setLoaderDelay] = useSessionStorage('loaderDelay', 500);
  const [pendingMs, setPendingMs] = useSessionStorage('pendingMs', 1000);
  const [pendingMinMs, setPendingMinMs] = useSessionStorage(
    'pendingMinMs',
    500,
  );

  const store = useStore(useShallow((state) => state));

  return (
    <QueryClientProvider client={queryClient}>
      {/* <div className="items-left fixed bottom-2 left-2 z-50 flex w-52 flex-col flex-wrap gap-1 divide-y rounded border-b bg-white bg-opacity-75 text-xs shadow-md shadow-black/20 dark:bg-gray-800">
        <div className="space-y-2 p-2">
          <div className="flex gap-2">
            <button
              className="rounded bg-blue-500 p-1 px-2 text-white"
              onClick={() => {
                setLoaderDelay(150);
              }}
            >
              Fast
            </button>
            <button
              className="rounded bg-blue-500 p-1 px-2 text-white"
              onClick={() => {
                setLoaderDelay(500);
              }}
            >
              Fast 3G
            </button>
            <button
              className="rounded bg-blue-500 p-1 px-2 text-white"
              onClick={() => {
                setLoaderDelay(2000);
              }}
            >
              Slow 3G
            </button>
          </div>
          <div>
            <div>Loader Delay: {loaderDelay}ms</div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={loaderDelay}
              onChange={(e) => setLoaderDelay(e.target.valueAsNumber)}
              className="w-full"
            />
          </div>
        </div>
        <div className="space-y-2 p-2">
          <div className="flex gap-2">
            <button
              className="rounded bg-blue-500 p-1 px-2 text-white"
              onClick={() => {
                setPendingMs(1000);
                setPendingMinMs(500);
              }}
            >
              Reset to Default
            </button>
          </div>
          <div>
            <div>defaultPendingMs: {pendingMs}ms</div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={pendingMs}
              onChange={(e) => setPendingMs(e.target.valueAsNumber)}
              className="w-full"
            />
          </div>
          <div>
            <div>defaultPendingMinMs: {pendingMinMs}ms</div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={pendingMinMs}
              onChange={(e) => setPendingMinMs(e.target.valueAsNumber)}
              className="w-full"
            />
          </div>
        </div>
      </div> */}
      <RouterProvider
        router={router}
        defaultPreload="intent"
        defaultPendingMs={pendingMs}
        defaultPendingMinMs={pendingMinMs}
        context={{
          store,
          queryClient,
        }}
      />
    </QueryClientProvider>
  );
}
