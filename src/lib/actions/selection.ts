import debounce from 'lodash.debounce';
import type { Action } from 'svelte/action';
import { readable } from 'svelte/store';

import { browser } from '$app/environment';

interface ISelection {
	selection: Selection | null;
	/** The DOMRect of the first range i.e. getRangeAt(0), updated on resize */
	rect?: DOMRect | undefined;
}

export const selection: Action<
	HTMLElement,
	{ cb: (sel: Selection) => void; scrollEl?: HTMLElement }
> = (node: HTMLElement, opts) => {
	let ticking = false;
	let lastScrollEl = opts?.scrollEl || document;
	let cb = opts?.cb;
	const handleChange = () => {
		const selection = document.getSelection();
		if (cb && selection) cb(selection);
		ticking = false;
	};
	const onScroll = () => {
		console.log('scroll');
		const x = requestAnimationFrame(handleChange);
		console.log(x);
		if (!ticking) {
			console.log('requesting animation frame');
			ticking = true;
		}
	};
	const onPointerUp = debounce(handleChange, 50, {
		leading: true,
	});
	const onSelectionChange = debounce(handleChange, 100, {
		leading: true,
	});
	const onResize = debounce(handleChange, 100);
	// if (browser) document.addEventListener('selectionchange', debounce(handleSelect, 50));
	// todo: i'm using pointerup to avoid re-calculating each time selection changes, but this maybe should be a separate store
	lastScrollEl.addEventListener('pointerup', onPointerUp);
	lastScrollEl.addEventListener('selectionchange', onSelectionChange);
	console.log(opts?.scrollEl);
	lastScrollEl.addEventListener('scroll', onScroll);
	window.addEventListener('resize', onResize);
	return {
		destroy: () => {
			document.removeEventListener('pointerup', onPointerUp);
			document.removeEventListener('selectionchange', onSelectionChange);
			lastScrollEl.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		},
		update: ({ scrollEl, cb: $cb }) => {
			if (scrollEl) {
				lastScrollEl.removeEventListener('scroll', onScroll);
				if (scrollEl) {
					lastScrollEl = scrollEl;
					lastScrollEl.addEventListener('scroll', onScroll);
				}
			}
			cb = $cb;
		},
	};
};
export { selection as default };

export const x = readable<ISelection>(undefined, (set) => {
	const handleResize = () => {
		const selection = window.getSelection();
		if (selection && !selection?.isCollapsed)
			set({
				selection,
			});
	};
	const handleSelect = () => {
		const selection = document.getSelection();
		if (selection && !selection?.isCollapsed)
			set({
				selection,
			});
	};
	const removeSelectionIfGone = () => {
		const selection = document.getSelection();
		if (!selection || selection.isCollapsed) {
			set({
				selection: null,
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
