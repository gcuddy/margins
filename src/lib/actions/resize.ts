import { browser } from '$app/env';
import debounce from 'lodash.debounce';
import type { Action } from './types';

export default (
	node: HTMLElement,
	cb: (entry: ResizeObserverEntry) => void
): ReturnType<Action> => {
	let observer: ResizeObserver;
	const onResize: ResizeObserverCallback = (entries) => {
		for (const entry of entries) {
			console.log({ entry });
			cb(entry);
		}
	};
	node.getBoundingClientRect();
	if (browser) {
		console.log('setting up resize observer for', node);
		observer = new ResizeObserver(debounce(onResize, 300));
		observer.observe(node);
	}
	return {
		destroy: () => {
			if (browser) {
				observer && observer.disconnect();
			}
		}
	};
};
