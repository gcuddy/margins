import type { ServerMutations } from '@margins/features/replicache/server';
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getRPC } from '../components/rpc-provider.svelte';

type CreateNoteInput = ServerMutations['annotation_create']['input'];
export function useCreateNoteMutation(entryID: string) {
	const rpc = getRPC();
	const queryClient = useQueryClient();
	const createNoteMutation = createMutation({
		mutationFn: (args: CreateNoteInput) =>
			rpc.mutate('annotation_create', args),
		onMutate: async (args) => {
			// TODO: optimistic update
		},
		onSuccess: () => {
			// weee
			queryClient.invalidateQueries({
				queryKey: ['annotations', entryID],
			});
		},
	});
	return createNoteMutation;
}
