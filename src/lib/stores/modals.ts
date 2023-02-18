import { browser } from "$app/environment";
import type ModalContainerSvelte from "$lib/components/modals/ModalContainer.svelte";
import type { Annotation, Highlight } from "@prisma/client";
import { derived, writable, type Readable } from "svelte/store";
import { showCommandPalette } from "./commands";
import type { ComponentProperties, StoredComponent, SvelteComponentWithProps } from "./types";

export const showURLModal = writable(false);
export const showRSSInputModal = writable(false);

export type ModalComponent = StoredComponent & {
	open: boolean;
	id?: string;
};

// add last action for closing etc?
function createModalStore() {
	const { subscribe, set, update } = writable<ModalComponent[]>([]);

	// isOpen is provided, as well as the index with modalInded
	// don't really understand the <T> part - credit to https://github.com/mattjennings/svelte-modals/blob/main/src/lib/store.ts
	// read this here https://www.typescriptlang.org/docs/handbook/2/generics.html
	const open = <T>(
		component: SvelteComponentWithProps<T>,
		props?: Omit<T, "isOpen" | "modalIndex">,
		id?: string
	) => {
		let index = 0;
		update((stack) => {
			const newStack = [...stack, { component, props, id, open: true }];
			index = newStack.length;
			console.log({ newStack });
			return newStack;
		});
		return index;
	};

	/**
	 * Closes the top modal or the modal with the index specified
	 * @param idx number (optional) - the index of the modal to close. If not provided removes top element
	 */
	const close = ({ idx, id }: { idx?: number; id?: string }) =>
		update((stack) => {
			let removed = [];
			if (idx) {
				stack[idx].open = false;
				removed = stack.splice(idx, 1);
			} else if (id) {
				const idx = stack.findIndex((s) => s.id === id);
				stack[idx].open = false;
				return stack.filter((modal) => modal.id !== id);
				const index = stack.findIndex((modal) => modal.id === id);
				if (index !== -1) {
					stack[index].open = false;
					removed = stack.splice(index, 1);
				}
			} else if (!removed.length) {
				console.log(`closing top modal`);
				stack[stack.length - 1].open = false;
				stack.splice(-1);
				console.log({ stack });
				// const removed = stack.pop();
			}
			console.log({ stack, removed, idx, id });
			if (stack.length === 0 && browser) {
				// not sure if this is the right place for this, but hey
				// let's make sure this is gone or we won't be able to scroll
				document.body.classList.remove("overflow-hidden");
			}
			return stack;
		});

	const closeAll = () => set([]);

	return {
		subscribe,
		open,
		close,
		closeAll,
	};
}

export const modals = createModalStore();
// https://github.com/mattjennings/svelte-modals/blob/main/src/lib/store.ts - very useful, allows you to prop pass props in

export const animationHappening = writable(false);
