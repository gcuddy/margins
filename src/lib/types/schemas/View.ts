import { writable } from 'svelte/store';
import { z } from 'zod';

interface BaseViewOptions {
	sort: string;
	properties: {
		[key: string]: boolean;
	};
}

export const ViewOptionsSchema = z.object({
	view: z.enum(['list', 'grid']),
	sort: z.enum(['title', 'date', 'author', 'createdAt', 'updatedAt', 'manual']),
	properties: z.object({
		author: z.boolean(),
		site: z.boolean(),
		description: z.boolean(),
		tags: z.boolean(),
		annotationCount: z.boolean(),
		date: z.boolean(),
		wordCount: z.boolean(),
		readProgress: z.boolean(),
		location: z.boolean(),
		image: z.boolean(),
		url: z.boolean(),
		pageNote: z.boolean(),
	}),
});

export type ViewOptions = z.infer<typeof ViewOptionsSchema>;

export const defaultViewOptions: ViewOptions = {
	view: 'list',
	sort: 'title',
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

// export type ViewOptions = typeof viewOptions;
