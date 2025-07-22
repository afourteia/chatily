// this is kept in a separate file so it enables React Fast Refresh
import { QueryClient } from '@tanstack/react-query';
// import { defaultMutateFn, ModelName, QueryKey } from "./utils/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // default: true
      refetchOnMount: true, // default: not sure
      staleTime: 1000 * 60 * 4, // milliseconds
      gcTime: 1000 * 60 * 10, // milliseconds
      retryOnMount: true, // default: true
      retry: 2, // default: 3
      refetchInterval: 1000 * 30, // milliseconds
      // refetchInterval: 1000 * 60 * 2, // milliseconds
      //     queryFn: ({ queryKey }) => {
      //       const test = ["User", "findMany", { select: { id: true } }] as const;
      //       if (queryKey.length === 3) {
      //         defaultQueryFn(test);
      //       } else {
      //         throw new Error("Invalid query key");
      //       }
      //     },
    },
    //   mutations: {
    //     mutationFn: (mutationObject: string) => {
    //       const [modelName, operation, arg] = mutationObject as QueryKey<
    //         ModelName,
    //         "create" | "update" | "delete",
    //         object
    //       >;
    //       defaultMutateFn([modelName, operation, arg]);
    //       return "test";
    //     },
    //   },
  },
});
