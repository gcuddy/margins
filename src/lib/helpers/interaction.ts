import type { EntryInteraction } from '$lib/queries/server';

export const makeInteraction = (
	interaction: Partial<EntryInteraction> & Pick<EntryInteraction, 'id'>
): EntryInteraction => {
	const { id, ...restInteraction } = interaction;
	return {
		id,
		title: null,
		note: null,
		progress: 0,
		currentPage: null,
		date_finished: null,
		date_started: null,
		...restInteraction
	};
};
