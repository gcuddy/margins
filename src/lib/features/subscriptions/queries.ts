
import type { TRPCClientInit } from "trpc-sveltekit";

export const listSubscriptionsQuery = (e?: TRPCClientInit) => ({
    queryKey: ["subscriptions", "list"],
    queryFn: async () => trpc(e).subscriptions.list.query(),
})
