import type { ServerMutations } from '@margins/features/replicache/server';
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getRPC } from '../components/rpc-provider.svelte';
import type { Annotation } from '@margins/features/core';

type CreateNoteInput = ServerMutations['annotation_create']['input'];
export function useCreateNoteMutation(entryID: string) {
	const rpc = getRPC();
	const queryClient = useQueryClient();
	const createNoteMutation = createMutation({
		mutationFn: (args: CreateNoteInput) =>
			rpc.mutate('annotation_create', args),
		onMutate: async (newAnnotation) => {
			// TODO: optimistic update
			await queryClient.cancelQueries({
				queryKey: ['annotations', entryID],
			});

			const previousNotes = queryClient.getQueryData<Annotation.Item[]>([
				'annotations',
				entryID,
			]);

			const annotation = {
				body: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: '...',
				...newAnnotation,
			} as Annotation.Item;

			queryClient.setQueryData<Annotation.Item[]>(
				['annotations', entryID],
				(old) => {
					if (!old) return [annotation as Annotation.Item];
					return [...old, annotation as Annotation.Item];
				},
			);

			return { previousNotes };
		},
		// eslint-disable-next-line sort-keys-fix/sort-keys-fix
		onError: (err, variables, context) => {
			if (context)
				queryClient.setQueryData(
					['annotations', entryID],
					context.previousNotes,
				);
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
