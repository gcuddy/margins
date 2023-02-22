import debounce from 'lodash.debounce';

import { browser } from '$app/environment';

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
