import { browser } from '$app/environment';
import debounce from 'lodash.debounce';
import { readable } from 'svelte/store';

interface ISelection {
	selection: Selection | null;
	/** The DOMRect of the first range i.e. getRangeAt(0), updated on resize */
	rect: DOMRect | undefined;
}

export default readable<ISelection>(undefined, (set) => {
	const getRect = (sel: Selection | null) => {
		if (!sel) return;
		const range = sel.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		return rect;
	};
	const handleResize = () => {
		const selection = window.getSelection();
		if (!selection?.isCollapsed) set({ selection, rect: getRect(selection) });
	};
	const handleSelect = () => {
		const selection = document.getSelection();
		if (!selection?.isCollapsed) set({ selection, rect: getRect(selection) });
	};
	const removeSelectionIfGone = () => {
		const selection = document.getSelection();
		if (!selection || selection.isCollapsed) {
			set({
				selection: null,
				rect: undefined,
			});
		}
	};
	// if (browser) document.addEventListener('selectionchange', debounce(handleSelect, 50));
	// todo: i'm using pointerup to avoid re-calculating each time selection changes, but this maybe should be a separate store
	if (browser)
		document.addEventListener(
			'pointerup',
			debounce(handleSelect, 50, {
				leading: true,
			})
		);
	if (browser)
		document.addEventListener(
			'selectionchange',
			debounce(removeSelectionIfGone, 100, {
				leading: true,
			})
		);
	if (browser) window.addEventListener('resize', debounce(handleResize, 100));
	return () => {
		if (browser) document.removeEventListener('pointerup', handleSelect);
		if (browser) document.removeEventListener('selectionchange', removeSelectionIfGone);
		if (browser) window.removeEventListener('resize', handleResize);
	};
});
