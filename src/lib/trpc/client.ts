import superjson from "superjson";
import { createTRPCClient,type TRPCClientInit } from "trpc-sveltekit";

import type { Router } from "$lib/trpc/router";


let browserClient: ReturnType<typeof createTRPCClient<Router>>;

// let browserClient: ReturnType<typeof svelteQueryWrapper<Router>>;


// Now with svelte-query
// export function trpc(init?: TRPCClientInit, queryClient?: QueryClient) {
//     const isBrowser = typeof window !== 'undefined';
//     if (isBrowser && browserClient) return browserClient;
//     const client = svelteQueryWrapper<Router>({
//         client: createTRPCClient<Router>({ init, transformer: superjson }),
//         queryClient
//     });
//     if (isBrowser) browserClient = client;
//     return client;
// }
export function trpc(init?: TRPCClientInit) {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser && browserClient) return browserClient;
    const client = createTRPCClient<Router>({ init, transformer: superjson });
    if (isBrowser) browserClient = client;
    return client;
    // if (typeof window === "undefined")
    //     return createTRPCClient<Router>({
    //         init,
    //         transformer: superjson,
    //     });
    // if (!browserClient)
    //     browserClient = createTRPCClient<Router>({
    //         transformer: superjson,
    //     });
    // return browserClient;
}

import type { QueryClient } from '@tanstack/svelte-query';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';

let browserClient2: ReturnType<typeof svelteQueryWrapper<Router>>;

export function trpcWithQuery(init?: TRPCClientInit, queryClient?: QueryClient) {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient2) return browserClient2;
  const client = svelteQueryWrapper<Router>({
    client: createTRPCClient<Router>({ init, transformer: superjson  }),
    queryClient
  });
  if (isBrowser) browserClient2 = client;
  return client;
}
