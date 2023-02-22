import type { TRPCClientInit } from "trpc-sveltekit";

import { trpc } from "$lib/trpc/client";
import type { RouterInputs } from "$lib/trpc/router";

export const createAnnotationMutation = (init?: TRPCClientInit) => ({
    mutationFn: (input: RouterInputs["annotations"]["create"]) => trpc(init).annotations.create.mutate(input)
})
export const updateAnnotationMutation = (init?: TRPCClientInit) => ({
    mutationFn: (input: RouterInputs["annotations"]["save"]) => trpc(init).annotations.save.mutate(input)
})
