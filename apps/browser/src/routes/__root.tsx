import {
  Link,
  MatchRoute,
  Outlet,
  // createRootRoute,
  createRootRouteWithContext,
  useLocation,
  useMatchRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Sidebar from '@/components/sidebar';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import {
  ChartColumnStackedIcon,
  ChartNoAxesCombinedIcon,
  CloudAlert,
  HouseIcon,
  SquareSigmaIcon,
  Bell,
  FolderSync,
} from 'lucide-react';
// import {s}
import { AppSidebar, navMain } from '@/components/app-sidebar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { FileRouteTypes } from '@/routeTree.gen';
import { useStore, type Store, zustandStorageName, storeVersion } from '@/store/use-store';
import { QueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
// import { useDbReader, useProcedure, useSeeder } from '@/utils/api';
import { queryClient } from '@/query-client';
import { Badge } from '@/components/ui/badge';
import { transmissionStageEnum } from '@chatally/enum';
import dalilNameLogoH from '@/assets/img/name-logo-h.png';
import { useEffect } from 'react';

export interface MyRouterContext {
  queryClient: QueryClient;
  store: Store;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>Route not found</p> <Link to="/">Home</Link>
      </div>
    );
  },
});

// export const Route = createRootRoute({
//   component: RootComponent,
//   notFoundComponent: () => {
//     return (
//       <div>
//         <p>Route not found</p> <Link to="/">Home</Link>
//       </div>
//     );
//   },
// });

function RootComponent() {
  const activeRouteName = useLocation().pathname;
  const findTitleByUrl = (url: string) => {
    for (const navItem of navMain) {
      if (navItem.items) {
        const foundItem = navItem.items.find((item) => item.url === url);
        if (foundItem) {
          return foundItem.title;
        }
      }
    }
    return null; // Or a default title if you prefer
  };

  // const resetStore = useStore((state) => state.reset);
  // useStore.persist.rehydrate()
  // useEffect(() => {
  //   if (storeVersion !== useStore.persist.getOptions().version || useStore.persist.getOptions().name !== zustandStorageName) {
  //     useStore.persist.clearStorage();
  //     const migrate = useStore.persist.getOptions().migrate;
  //     console.log(migrate)
  //     if (migrate) {
  //       // You may want to provide the actual persisted state and version here
  //       // For now, pass undefined and the current version as a fallback
  //       migrate({}, 2);
  //     }
  //   }
  // }, []);



  // const resetDB = useSeeder();
  const activeTitle = findTitleByUrl(activeRouteName);
  const navigate = useNavigate();

  return (
    <div className="h-dvh w-dvw select-none" dir="rtl">
      {/* <div
        dir="ltr"
        className="flex max-h-dvh max-w-full flex-row gap-1 overflow-auto"
      > */}
      <SidebarProvider

      // style={
      //   {
      //     '--sidebar-width': '230px',
      //   } as React.CSSProperties
      // }
      >
        <AppSidebar side="right" />
        <SidebarInset>
          <div
            className="sticky max-h-12 start-0 top-0 flex shrink-0 items-center gap-2 border-b p-2 py-1"
            style={
              import.meta.env.DEV
                ? {
                  backgroundImage:
                    'linear-gradient(45deg, #d1d5db 25%, transparent 25%, transparent 75%, #d1d5db 75%), linear-gradient(45deg, #d1d5db 25%, transparent 25%, transparent 75%, #d1d5db 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }
                : undefined
            }
          >
            <SidebarTrigger className="-ms-1 rotate-180" />
            <Separator orientation="vertical" className="me-2 h-4" />
            <h1 className="text-lg me-auto font-bold">{activeTitle}</h1>
            {/* {import.meta.env.DEV && (
              <Button
                disabled={resetDB.isPending}
                onClick={() => resetDB.mutate(undefined)}
              >
                {resetDB.isPending
                  ? 'جاري تجديد قاعدة البيانات...'
                  : resetDB.isError
                    ? 'هناك خطأ'
                    : 'تجديد قاعدة البيانات'}
              </Button>
            )} */}
            {/* <Notification /> */}
            {/* <Button
              size="icon"
              variant="outline"
              onClick={() => {
                queryClient.invalidateQueries();
              }}
            >
              <FolderSync />
            </Button> */}
            <img
              src={dalilNameLogoH}
              alt="dalil name logo"
              className="h-full"
            />

          </div>

          <Outlet />
        </SidebarInset>
      </SidebarProvider>

      {/* </div> */}
      {/* <ReactQueryDevtools buttonPosition="top-right" /> */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div >
  );
}


// function Notification() {
//   const userId = useStore((state) => state.userId);
//   const notificationCount = useDbReader(
//     'Notification',
//     'count',
//     {
//       where: {
//         userId: userId ?? '',
//         transmissionStageId: transmissionStageEnum.ids.SENT
//       },

//     },
//     [
//     ],
//     {
//       refetchInterval: 5 * 1000,
//       enabled: !!userId, // Only run if userId is defined
//     }
//   )
//   console.log('notificationCount', notificationCount.data);

//   if (!userId) {
//     return (
//       <Badge variant='outline' >
//         اشعارات غير مفعل
//       </Badge>
//     )
//   }

//   if (notificationCount.error) {
//     return <Button
//       onClick={() => notificationCount.refetch()}
//       size='icon'
//       variant="destructive"
//     >
//       <CloudAlert />
//     </Button>
//   }
//   return (
//     <Button
//       onClick={() => notificationCount.refetch()}
//       size='icon'
//       variant="ghost"
//     >
//       <div className="relative">
//         <Bell />
//         {notificationCount.data && notificationCount.data > 0 && (
//           <Badge className="absolute -top-3 -start-3 m-1 h-4 w-4 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
//             {notificationCount.data}
//           </Badge>
//         )}
//       </div>
//     </Button>
//   )
// }