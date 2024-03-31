import { getContext, setContext } from 'svelte';
import type { Writable} from 'svelte/store';
import { writable } from 'svelte/store';

const symbol = Symbol('shell');

type Ctx = {
	isSidebarVisible?: Writable<boolean>;
};

export function createCtx(): Ctx {
	const ctx = {
		isSidebarVisible: writable(true),
	};

	setContext(symbol, ctx);

	return ctx;
}

export function getCtx(): Ctx {
	const ctx = getContext<Ctx>(symbol);
	if (!ctx) {
		throw new Error('No context for shell found');
	}
	return ctx;
}
