import { query } from '$lib/queries/query';

export const load = async (e) => {
	const { parent, fetch, data, params, url } = e;
	const { queryClient } = await parent();
	const { tag: name } = params;
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['tag', name],
			queryFn: async () => query(e, 'get_tag_deets', { name })
		}),
		url.searchParams.get('tab') === 'notes'
			? queryClient.prefetchQuery({
					queryKey: ['tag', name, 'notes'],
					queryFn: async () => query(e, 'get_notes_for_tag', { name })
			  })
			: queryClient.prefetchQuery({
					queryKey: ['tag', name, 'entries'],
					queryFn: async () => query(e, 'get_entries_for_tag', { name })
			  })
	]);
    return {
        ...data,
        tag: name
    }
};
