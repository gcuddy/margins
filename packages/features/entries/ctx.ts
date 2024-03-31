import { getContext, setContext } from 'svelte';
import { persisted } from 'svelte-persisted-store';
import type { Writable } from 'svelte/store';

const symbol = Symbol('entry');

type Ctx = {
	inspectorWidth: Writable<number>;
	isInspectorVisible: Writable<boolean>;
};

export function createEntryCtx(): Ctx {
	const ctx = {
		inspectorWidth: persisted('rightInspectorWidth', 300),
		isInspectorVisible: persisted('rightInspectorVisible', false),
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
