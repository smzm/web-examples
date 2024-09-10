// 'use client';

// import getIdFromCookie from '@/app/actions/authentication/cookies/getIdFromCookie';
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQuery,
// } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// export default function QueryProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: {
//         // staleTime: Infinity,
//         refetchOnWindowFocus: true,
//       },
//     },
//   });

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ReactQueryDevtools />
//       {children}
//       {/* <Cookie>{children}</Cookie> */}
//     </QueryClientProvider>
//   );
// }

// export function Cookie({ children }: { children: React.ReactNode }) {
//   // * React Query
//   const { data: id } = useQuery({
//     queryKey: ['id'],
//     queryFn: async () => {
//       return await getIdCookie();
//     },
//   });

//   return <>{children}</>;
// }
