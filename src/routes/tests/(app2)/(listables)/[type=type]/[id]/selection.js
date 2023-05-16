import { onMount } from "svelte";
import { createPopperActions } from "svelte-popperjs";
import { derived, writable } from "svelte/store";

/**
 * 
 * @returns {{selection: import('svelte/store').Writable<Selection | null>, virtualEl: import('svelte/store').Readable<{getBoundingClientRect: () => DOMRect}>, popperContent: import('svelte-popperjs').ContentAction<any>, mouse_down: import('svelte/store').Writable<boolean>}}
 */
export function setup() {

	/**
	 * @type {import('svelte/store').Writable<Selection | null>}
	 */
	const selection = writable(null);

	const virtualEl = derived(selection, ($selection) => {
		if (!$selection || !$selection.rangeCount || $selection.isCollapsed)
			return {
				getBoundingClientRect: () =>
					/** @type {DOMRect} */({
					top: 0,
					left: 0,
					width: 0,
					height: 0,
					bottom: 0,
					right: 0
				})
			};
		const range = $selection.getRangeAt(0);
		return {
			getBoundingClientRect: () => range.getBoundingClientRect()
		};
	})

	const handle_select = () => {
		console.log('handle_select');
		const fn = () => {
			selection.set(window.getSelection());
		};
		requestAnimationFrame(fn)
	};

	const [popperRef, popperContent] = createPopperActions({
		strategy: 'fixed',
		placement: 'top',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 12]
				}
			}
		]
	})

	popperRef(virtualEl)


	const mouse_down = writable(false);


	onMount(() => {
		document.addEventListener('selectionchange', handle_select);
		document.addEventListener('mousedown', () => mouse_down.set(true));
		document.addEventListener('mouseup', () => mouse_down.set(false));
		return () => {
			document.removeEventListener('selectionchange', handle_select);
			document.removeEventListener('mousedown', () => mouse_down.set(true));
			document.removeEventListener('mouseup', () => mouse_down.set(false));
		}
	});

	return {
		selection,
		virtualEl,
		popperContent,
		mouse_down
	}

}