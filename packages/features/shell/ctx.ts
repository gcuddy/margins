import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';
import type { BookmarkWithEntry } from '../data/library.js';

const symbol = Symbol('shell');

type EntryContext = {
	breadcrumbs: { href: string; text: string }[];
	currentIndex?: number;
	currentList?: BookmarkWithEntry[];
};

type Ctx = {
	entryContext: Writable<EntryContext>;
	isSidebarVisible: Writable<boolean>;
};

export function createCtx(): Ctx {
	const ctx = {
		entryContext: persisted(
			'entryContext',
			{ breadcrumbs: [] },
			{
				storage: 'session',
			},
		),
		isSidebarVisible: writable(true),
	};

	setContext(symbol, ctx);

	return ctx;
}

export function getShellCtx(): Ctx {
	const ctx = getContext<Ctx>(symbol);
	if (!ctx) {
		throw new Error('No context for shell found');
	}
	return ctx;
}
