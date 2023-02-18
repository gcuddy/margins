import type { CreateMutationOptions } from "@tanstack/svelte-query"
import type { TRPCClientInit } from "trpc-sveltekit"

import type { RouterInputs } from "$lib/trpc/router"

const queryKeys = () => ({
    annotations: ['annotations'],
    annotation: (id: number) => ['annotation', id],

})
export const annotateMutation = (input: RouterInputs["annotations"]["save"], init?: TRPCClientInit) => ({
    mutationFn: async () => trpc(init).annotations.save.mutation(input),
}) satisfies CreateMutationOptions
