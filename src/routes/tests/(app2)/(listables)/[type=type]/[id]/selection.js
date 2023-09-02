import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';
import { createPopperActions } from 'svelte-popperjs';

/**
 *
 * @returns {{selection: import('svelte/store').Writable<Selection | null>, virtualEl: import('svelte/store').Readable<{getBoundingClientRect: () => DOMRect}>, popperContent: import('svelte-popperjs').ContentAction<any>, show: import('svelte/store').Readable<boolean>}}
 */
export function setup() {
	/**
	 * @type {import('svelte/store').Writable<Selection | null>}
	 */
	const selection = writable(null);

	const virtualEl = derived(selection, ($selection) => {
		if (!$selection?.rangeCount || $selection.isCollapsed) {
			return {
				getBoundingClientRect: () =>
					/** @type {DOMRect} */ ({
						bottom: 0,
						height: 0,
						left: 0,
						right: 0,
						top: 0,
						width: 0,
					}),
			};
		}
		const range = $selection.getRangeAt(0);
		return {
			getBoundingClientRect: () => range.getBoundingClientRect(),
		};
	});

	const setSelectionFn = () => {
		selection.set(window.getSelection());
	};
	const handleSelect = () => {
		requestAnimationFrame(setSelectionFn);
	};

	const [popperRef, popperContent] = createPopperActions({
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 12],
				},
			},
		],
		placement: 'top',
		strategy: 'fixed',
	});

	popperRef(virtualEl);

	const show = derived(selection, ($selection) => {
		if (!$selection?.rangeCount || $selection.isCollapsed) {
			return false;
		}
		const range = $selection.getRangeAt(0);
		const parent = range.commonAncestorContainer.parentElement;
		if (!parent) {
			return false;
		}
		if (!parent.closest('#article, #viewer')) {
			return false;
		}
		if (
			range.startContainer.parentElement?.closest('[data-annotation-id]') ??
			range.endContainer.parentElement?.closest('[data-annotation-id]')
		) {
			return false;
		}
		const text = range.toString();
		return text.length > 0;
	});

	onMount(() => {
		document.addEventListener('selectionchange', handleSelect);
		return () => {
			document.removeEventListener('selectionchange', handleSelect);
		};
	});

	return {
		popperContent,
		selection,
		show,
        virtualEl
	};
}
