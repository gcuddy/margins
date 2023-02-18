import superjson from "superjson";
import { type TRPCClientInit, createTRPCClient } from "trpc-sveltekit";

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
