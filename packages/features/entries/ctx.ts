import { getContext, setContext } from 'svelte';
import type { Writable} from 'svelte/store';
import { writable } from 'svelte/store';

const symbol = Symbol('entry');

type Ctx = {
	isInspectorVisible: Writable<boolean>;
};

export function createEntryCtx(): Ctx {
	const ctx = {
		isInspectorVisible: writable(false),
	};

	setContext(symbol, ctx);

	return ctx;
}

export function getEntryCtx(): Ctx {
	const ctx = getContext<Ctx>(symbol);
	if (!ctx) {
		throw new Error('No context for entry found');
	}
	return ctx;
}
