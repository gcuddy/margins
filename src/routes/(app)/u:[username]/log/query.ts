import { trpc } from "$lib/trpc/client";
import type { TRPCClientInit } from "trpc-sveltekit";

export const logQuery = (e: TRPCClientInit) => ({
    queryKey: ["log"],
    queryFn: async () => trpc(e).log.list.query(),
})