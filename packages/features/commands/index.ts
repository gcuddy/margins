import type { ComponentType } from 'svelte';
import Rss from 'lucide-svelte/icons/rss';
import Book from 'lucide-svelte/icons/book';
import Podcast from 'lucide-svelte/icons/podcast';
import Film from 'lucide-svelte/icons/film';
import URLIcon from 'lucide-svelte/icons/link';

export type Command<TId = string> = {
	action: () => void | Promise<void>;
	category?: string;
	disabled?: boolean;
	icon: ComponentType;
	/** An optional id, to identify it later. */
	id?: TId;
	keywords?: string;
	label: string;
};

export const addCommands: (opts?: { prefix: string }) => Command[] = (
	opts = {
		prefix: 'Add ',
	},
) => [
	{
		action: () => console.log('Add URL'),
		icon: URLIcon,
		label: opts.prefix + 'URL',
	},
	{
		action: () => console.log('Add Subscription'),
		icon: Rss,
		label: opts.prefix + 'Subscription',
	},
	{
		action: () => console.log('Add Book'),
		icon: Book,
		label: opts.prefix + 'Book',
	},
	{
		action: () => console.log('Add Movie or TV Show'),
		icon: Film,
		label: opts.prefix + 'Movie or TV Show',
	},
	{
		action: () => console.log('Add Podcast'),
		icon: Podcast,
		label: opts.prefix + 'Podcast',
	},
];
