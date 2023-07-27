import type { createCombobox } from '@melt-ui/svelte';

export type CreateCombobox<T> = ReturnType<typeof createCombobox<T>>;

export type Items<T> =
	| T[]
	| {
			heading: string /* group */;
			items: T[];
	  }[];
