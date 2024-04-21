import { createQuery } from '@tanstack/svelte-query';
import { getRPC } from '../components/rpc-provider.svelte';

export function useNotesQuery(entryID: string) {
	const rpc = getRPC();
	// const queryClient = useQueryClient();

	const notes = createQuery({
		queryFn: () => rpc.query('annotations_fromEntryId', { id: entryID }),
		queryKey: ['annotations', entryID],
	});

	return notes;
}
