import { browser } from '$app/env';
import type ModalContainerSvelte from '$lib/components/modals/ModalContainer.svelte';
import type { Annotation, Highlight } from '@prisma/client';
import { derived, writable, type Readable } from 'svelte/store';
import { showCommandPalette } from './commands';
import type { ComponentProperties, StoredComponent, SvelteComponentWithProps } from './types';

export const showURLModal = writable(false);
export const showRSSInputModal = writable(false);

export type ModalComponent = StoredComponent & {
	containerProps?: ComponentProperties<ModalContainerSvelte>;
};

// add last action for closing etc?
function createModalStore() {
	const { subscribe, set, update } = writable<ModalComponent[]>([]);

	// isOpen is provided, as well as the index with modalInded
	// don't really understand the <T> part - credit to https://github.com/mattjennings/svelte-modals/blob/main/src/lib/store.ts
	// read this here https://www.typescriptlang.org/docs/handbook/2/generics.html
	const open = <T>(
		component: SvelteComponentWithProps<T>,
		props?: Omit<T, 'isOpen' | 'modalIndex'>,
		containerProps?: ComponentProperties<ModalContainerSvelte>
	) => {
		let index = 0;
		update((stack) => {
			const newStack = [...stack, { component, props, containerProps }];
			index = newStack.length;
			return newStack;
		});
		return index;
	};

	/**
	 * Closes the top modal or the modal with the index specified
	 * @param idx number (optional) - the index of the modal to close. If not provided removes top element
	 */
	const close = (idx?: number) =>
		update((stack) => {
			if (idx) {
				stack.splice(idx, 1);
			} else {
				console.log(`closing top modal`);
				stack.pop();
			}
			if (stack.length === 0 && browser) {
				// not sure if this is the right place for this, but hey
				// let's make sure this is gone or we won't be able to scroll
				document.body.classList.remove('overflow-hidden');
			}
			return stack;
		});

	const closeAll = () => set([]);

	return {
		subscribe,
		open,
		close,
		closeAll
	};
}

export const modals = createModalStore();
// https://github.com/mattjennings/svelte-modals/blob/main/src/lib/store.ts - very useful, allows you to prop pass props in

export const animationHappening = writable(false);
