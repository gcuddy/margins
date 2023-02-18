import debounce from "lodash.debounce";

import { browser } from "$app/environment";

import type { Action } from "./types";

export default (node: HTMLElement, cb: (entry: ResizeObserverEntry) => void): ReturnType<Action> => {
	let observer: ResizeObserver | undefined = undefined;
	if (!observer) {
		observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				cb(entry);
			}
		});
	}
	observer.observe(node);
	return {
		destroy: () => {
			if (browser) {
				observer && observer.unobserve(node);
			}
		},
	};
};
