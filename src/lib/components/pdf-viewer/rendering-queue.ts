// Implementation of PDF.JS rendering queue with svelte store
// Can use by using setContext with a parent component

import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

type Queue = {
	highestPriorityPage: string | null;
};

function create_rendering_queue() {
	const store = writable<Queue>({
		highestPriorityPage: null
	});

	return {
		subscribe: store.subscribe
	};
}

const symbol = Symbol('RenderingQueue');

/**
 * Creates a new rendering queue store, sets it in the context, and returns it.
 */
export function createRenderQueueContext() {
	const queue = create_rendering_queue();
	setContext(symbol, queue);
	return queue;
}

export function getRenderingQueueContext() {
    const ctx = getContext(symbol);
    if (!ctx) {
        throw new Error('RenderingQueueContext not found');
    }
    return ctx as ReturnType<typeof create_rendering_queue>;
}


