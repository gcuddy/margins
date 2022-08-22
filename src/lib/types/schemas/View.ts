import { writable } from 'svelte/store';
import { z } from 'zod';

export const ViewOptionsSchema = z.object({
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
		location: z.boolean()
	})
});

export type ViewOptions = z.infer<typeof ViewOptionsSchema>;

export const defaultViewOptions: ViewOptions = {
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
		location: false
	}
};

export function createCustomizeViewStore(options = defaultViewOptions) {
	const { subscribe, set, update } = writable(options);
	return {
		subscribe,
		set,
		update,
		reset: () => set(options),
		softReset: () => set(options),
		hardReset: () => set(defaultViewOptions)
	};
}

// export type ViewOptions = typeof viewOptions;
