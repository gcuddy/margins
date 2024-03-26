import { query } from '$lib/queries/query';
import type { CreateQueryOptions } from '@tanstack/svelte-query';

export const tagDeets = (init: any, name: string) =>
	({
		queryKey: ['tag', name],
		queryFn: async () => query(init, 'get_tag_deets', { name }),
	}) satisfies CreateQueryOptions;

export const tagEntries = (init: any, name: string) =>
	({
		queryKey: ['tag', name, 'entries'],
		queryFn: async () => query(init, 'get_entries_for_tag', { name }),
	}) satisfies CreateQueryOptions;

export const tagNotes = (init: any, name: string) =>
	({
		queryKey: ['tag', name, 'notes'],
		queryFn: async () => query(init, 'get_notes_for_tag', { name }),
	}) satisfies CreateQueryOptions;
