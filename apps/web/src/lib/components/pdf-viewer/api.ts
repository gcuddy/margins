import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

type Api = {
	scale: number;
};

const symbol = Symbol('pdf_context');

export function pdf_context() {
	const store = writable<Api>({
		scale: 1
	});
	setContext(symbol, store);
	return store;
}

export function get_pdf_context() {
    const ctx = getContext(symbol);
    if (!ctx) {
        throw new Error('pdf_context not found');
    }
    return ctx as ReturnType<typeof pdf_context>;
}
