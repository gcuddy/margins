import type { EntryInteraction } from '$lib/queries/server';

export const makeInteraction = (
	interaction: Partial<EntryInteraction> & Pick<EntryInteraction, 'id'>
): EntryInteraction => {
	const { id, ...restInteraction } = interaction;
	return {
		currentPage: null,
		finished: null,
		id,
		note: null,
		progress: 0,
		started: null,
		title: null,
		...restInteraction,
	};
};
