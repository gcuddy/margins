import { browser } from '$app/environment';
import debounce from 'lodash.debounce';
import type { Action } from './types';

export default (node: HTMLElement, cb: (rect: DOMRect) => void): ReturnType<Action> => {
	const onResize = () => {
		const rect = node.getBoundingClientRect();
		cb(rect);
	};
	if (browser) {
		onResize();
		window.addEventListener('resize', debounce(onResize, 1000));
	}
	return {
		destroy: () => {
			if (browser) {
				window.removeEventListener('resize', onResize);
			}
		},
	};
};
