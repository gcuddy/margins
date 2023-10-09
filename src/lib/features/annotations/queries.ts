import type { CreateMutationOptions, CreateQueryOptions } from "@tanstack/svelte-query"
import type { TRPCClientInit } from "trpc-sveltekit"




export const annotationQueryKeys = {
    annotations: ['annotations'] as const,
    annotation: (id: string) => [...annotationQueryKeys.annotations, id] as const,
}

export const annotationDetailQuery = (id: string, init?: TRPCClientInit) => ({
    queryKey: annotationQueryKeys.annotation(id),
    queryFn: async () => trpc(init).annotations.detail.query({ id }),
    staleTime: 5 * 1000 * 60,
    enabled: !!id,
}) satisfies CreateQueryOptions


export const annotateMutation = (input: RouterInputs["annotations"]["save"], init?: TRPCClientInit) => ({
    mutationFn: async () => trpc(init).annotations.save.mutation(input),
}) satisfies CreateMutationOptions
