import { useStore } from '@/store/use-store';
import {
  createFileRoute,
  type FileRouteTypes,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DashboardContext } from '@/hooks/use-dashboard-context';
import { useShallow } from 'zustand/react/shallow';
import { useProductionUTCPeriod } from '@/hooks/use-production-period';
import { queryClient } from '../query-client';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async ({ context, search, params }) => {
    console.log('Dashboard Route fullPath:', Route.fullPath);
    console.log('Dashboard Route params:', params);
    if (context.store.authState.status === 'LoggedOut') {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.pathname as FileRouteTypes['fullPaths'],
          redirectReason: 'unAuthenticated',
          ...search,
        },
      });
    }
  },
  // loader: ({ context }) => {
  //   return { isAuth: context.store.isAuth };
  // },
  errorComponent: ({ error }: { error: Error }) => {
    if (error.message === 'Not authenticated') {
      return (
        <div className="flex items-center justify-center p-12 text-red-300">
          You must be logged in to view this page.
        </div>
      );
    }

    throw error;
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const authState = useStore((state) => state.authState);
  const updateAuthState = useStore((state) => state.updateAuthState);
  const { store } = Route.useRouteContext();
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const [initialProductionPeriodUTC, setInitialProductionPeriodUTC] = useState(
    useProductionUTCPeriod(),
  );

  //TODO: move this to a useEffect that depends on month and year change
  useEffect(() => {
    const intervalId = setInterval(
      () => {
        // only update if the production period has changed
        const newProductionUTCPeriod = useProductionUTCPeriod();
        if (
          initialProductionPeriodUTC.productionStartDateUTC.getTime() !==
            newProductionUTCPeriod.productionStartDateUTC.getTime() ||
          initialProductionPeriodUTC.productionEndDateUTC.getTime() !==
            newProductionUTCPeriod.productionEndDateUTC.getTime()
        ) {
          setInitialProductionPeriodUTC(newProductionUTCPeriod);
        }
      },
      1000 * 60 * 30, // Update every 30 minutes
    );
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (authState.status === 'LoggedOut') {
      navigate({
        to: '/login',
        search: {
          redirect: location.pathname as FileRouteTypes['fullPaths'],
          redirectReason: 'loggedOut',
          ...searchParams,
        },
      });
    }
  }, [authState]);

  // iterate over the keys of object store and updateAuth to false if any of them is undefined
  // const isAnyKeyUndefined = Object.keys(authState).some(
  //   (key) => authState[key as keyof typeof authState] === undefined,
  // );
  // if (isAnyKeyUndefined) {
  //   updateAuth(false);
  //   navigate({
  //     to: '/login',
  //     search: {
  //       redirect: location.pathname as FileRouteTypes['fullPaths'],
  //       redirectReason: 'loggedOut',
  //       ...searchParams,
  //     },
  //   });
  // }

  return (
    <div
      id="dashboardLayout"
      className="flex min-h-0 w-full flex-1 flex-col p-2 px-3"
      // dir="rtl"
    >
      {/* <div className="flex-none border-2 border-green-500 bg-red-100">
        Header
      </div> */}
      <DashboardContext.Provider
        value={{
          firstName: '',
          lastName: '',
          phone: '',
          employeeId: '',
          userId: '',
          departmentId: '',
          role: [],
          departmentReviewPermissions: [],
          ...initialProductionPeriodUTC,
        }}
      >
        <Outlet />
      </DashboardContext.Provider>
      {/* <div className="flex-none bg-blue-100">Footer</div> */}
    </div>
  );
}
