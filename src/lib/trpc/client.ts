import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";
import type { QueryClient } from '@tanstack/svelte-query';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';

import type { Router } from "$lib/trpc/router";
import { transformer } from "./transformer";

let browserClient: ReturnType<typeof svelteQueryWrapper<Router>>;

export function trpc(init?: TRPCClientInit, queryClient?: QueryClient) {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser && browserClient) return browserClient;
    const client = createTRPCClient<Router>({ init, transformer });
    const query_client = svelteQueryWrapper<Router>({
        client,
        queryClient: queryClient as any // <- this is bc of mismatching types with query-5
    })
    if (isBrowser) browserClient = query_client;
    return query_client;
}