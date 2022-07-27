import { browser } from '$app/env';
import { readable } from 'svelte/store';

// store that holds last 2 keypresses, clearing itself after 1 second
export default readable<[string, string]>(['', ''], (set) => {
	let ticking = false;
	let lastKeypress = '';
	let lastKeypress2 = '';
	let timeout: number;

	const reset = () => {
		lastKeypress = '';
		lastKeypress2 = '';
		set([lastKeypress, lastKeypress2]);
	};

	const updateKeypress = () => {
		set([lastKeypress2, lastKeypress]);
		ticking = false;
	};

	const onKeypress = (e: KeyboardEvent) => {
		lastKeypress2 = lastKeypress;
		lastKeypress = e.key;
		if (!ticking) {
			requestAnimationFrame(updateKeypress);
			ticking = true;
		}
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = window.setTimeout(reset, 750);
	};

	if (browser) document.addEventListener('keypress', onKeypress);

	return () => {
		if (browser) document.removeEventListener('keypress', onKeypress);
	};
});
