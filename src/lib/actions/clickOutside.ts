import type { Action } from './types';

/** Dispatch event on click outside of node */
export function clickOutside(
	node: HTMLElement,
	cb:
		| (() => void)
		| {
				cb: () => void;
				useOnChildrenInstead?: boolean;
		  }
): ReturnType<Action> {
	const handleClick = (event: MouseEvent) => {
		if (typeof cb !== 'function' && cb.useOnChildrenInstead) {
			const children = node.children;
			// todo: get parent of first focusable element and use that?
			// or this might not work at all...?
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (child && !child.contains(event.target as Node) && !event.defaultPrevented) {
					cb.cb();
				}
			}
		} else {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				typeof cb === 'function' ? cb() : cb.cb();
			}
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
