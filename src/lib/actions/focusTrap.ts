import { Keys } from '$lib/types/keyboard';
import { focusIn, Focus, FocusResult } from '$lib/utils/focus-management';
import type { Action } from './types';

// Action that sets up a focustrap

export default (node: HTMLElement, initialFocus?: HTMLElement): ReturnType<Action> => {
	function handleTab(event: KeyboardEvent) {
		if (event.key !== Keys.Tab) return;
		if (!document.activeElement) return;
		event.preventDefault();
		// const result = focusIn(node, (event.shiftKey ? Focus.Previous : Focus.Next) | Focus.WrapAround);
		// TODO: use previousactiveElement? maybe make a store that can be passed in?
		// if (result === FocusResult.Success) {

		// 	previousActiveElement = document.activeElement as HTMLElement;
		// 	break;
		// }
	}
	// focus first element on mount
	const result = focusIn(node, Focus.First);
	if (result !== FocusResult.Success) {
		console.warn(`No focusable elements in focus trap`);
	}
	node.addEventListener('keydown', handleTab);
	return {
		destroy: () => {
			node.removeEventListener('keydown', handleTab);
		}
	};
};
