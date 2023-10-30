import type { LibraryEntry } from '$lib/server/queries';
import { getContext } from 'svelte';
import { writable } from 'svelte/store';
import { z } from 'zod';

interface BaseViewOptions {
	sort: string;
	properties: {
		[key: string]: boolean;
	};
}

export const ViewOptionsSchema = z.object({
	view: z.enum(['list', 'grid', 'slim', 'kanban']),
	sort: z.enum([
		'title',
		'date',
		'due',
		'author',
		'published',
		'updated',
		'created',
		'manual',
	]),
	properties: z
		.object({
			author: z.boolean(),
			site: z.boolean(),
			description: z.boolean(),
			tags: z.boolean(),
			annotationCount: z.boolean(),
			date: z.boolean(),
			wordCount: z.boolean(),
			feed: z.boolean(),
			readProgress: z.boolean(),
			location: z.boolean(),
			image: z.boolean(),
			url: z.boolean(),
			pageNote: z.boolean(),
		})
		.partial(),
	dates: z
		.object({
			relative: z.boolean(),
		})
		.partial()
		.optional(),
});

export type ViewOptions = z.infer<typeof ViewOptionsSchema>;

export const defaultViewOptions: ViewOptions = {
	view: 'list',
	sort: 'created',
	properties: {
		author: true,
		site: true,
		description: true,
		tags: true,
		annotationCount: true,
		date: false,
		wordCount: false,
		readProgress: false,
		location: false,
		image: true,
		url: true,
		pageNote: true,
	},
};

function compareTwoMaybeDates(
	a: Date | null | undefined,
	b: Date | null | undefined,
) {
	if (a && b) {
		return a > b ? -1 : 1;
	} else if (a) {
		return -1;
	} else if (b) {
		return 1;
	} else {
		return 0;
	}
}

function compareTwoMaybeStrings(a: string | null, b: string | null) {
	if (a && b) {
		return a.localeCompare(b);
	} else if (a) {
		return -1;
	} else if (b) {
		return 1;
	} else {
		return 0;
	}
}

export function sortEntries(
	entries: LibraryEntry[],
	sort: ViewOptions['sort'],
) {
	switch (sort) {
		case 'title':
			return entries.sort((a, b) =>
				a.title ? a.title.localeCompare(b.title || '') : -1,
			);
		case 'date':
			return entries.sort((a, b) =>
				compareTwoMaybeDates(a.published, b.published),
			);
		case 'author':
			return entries.sort((a, b) => compareTwoMaybeStrings(a.author, b.author));
		case 'created':
			return entries.sort((a, b) =>
				compareTwoMaybeDates(a.bookmarked_at, b.bookmarked_at),
			);
		case 'published':
			return entries.sort((a, b) =>
				compareTwoMaybeDates(a.published, b.published),
			);
		case 'updated':
			return entries.sort((a, b) =>
				compareTwoMaybeDates(a.updatedAt, b.updatedAt),
			);
		// case "due":
		//     return entries.sort((a, b) => compareTwoMaybeDates(a.bookmarks?.[0]?.dueDate, b.bookmarks?.[0]?.dueDate));
		case 'manual':
			return entries;
		default:
			return entries;
	}
}

export function createCustomizeViewStore(options = defaultViewOptions) {
	const { subscribe, set, update } = writable(options);
	return {
		subscribe,
		set,
		update,
		reset: () => set(options),
		softReset: () => set(options),
		hardReset: () => set(defaultViewOptions),
	};
}

export const ViewOptionsContextKey = 'viewOptions';

function useViewOptions() {
	const options = getContext(ViewOptionsContextKey);
	if (!options) {
		console.error('ViewOptionsContextKey not found');
		return null;
	}
	return options as ReturnType<typeof createCustomizeViewStore>;
}

// export type ViewOptions = typeof viewOptions;
