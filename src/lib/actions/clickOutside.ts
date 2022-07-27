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
		console.log('clickOutside from');
		console.log({ node, event });
		if (typeof cb !== 'function' && cb.useOnChildrenInstead) {
			const children = node.children;
			// todo: get parent of first focusable element and use that?
			// or this might not work at all...?
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				console.log({ child });
				if (child && !child.contains(event.target as Node) && !event.defaultPrevented) {
					console.log('clicked outside of node', { node });
					console.log({ child });
					console.log({ event });
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
