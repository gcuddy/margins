import type { CreateQueryOptions } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";

import { trpc } from "$lib/trpc/client";


export const listTagsQuery = (init?: TRPCClientInit) => ({
    queryKey: ["tags", "list"],
    queryFn: async () => trpc(init).user.listTags.query(),
    staleTime: 1000 * 60,
    keepPreviousData: true
}) satisfies CreateQueryOptions