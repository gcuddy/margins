import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";
import type { QueryClient } from '@tanstack/svelte-query';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';

import type { Router } from "$lib/trpc/router";
import { transformer } from "./transformer";

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser && browserClient) return browserClient;
    const client = createTRPCClient<Router>({ init, transformer });
    if (isBrowser) browserClient = client;
    return client;
}


let browserClient2: ReturnType<typeof svelteQueryWrapper<Router>>;

export function trpcWithQuery(init?: TRPCClientInit, queryClient?: QueryClient) {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser && browserClient2) return browserClient2;
    const client = svelteQueryWrapper<Router>({
        client: createTRPCClient<Router>({ init, transformer }),
        queryClient
    });
    if (isBrowser) browserClient2 = client;
    return client;
}
