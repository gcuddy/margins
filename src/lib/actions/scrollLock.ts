import { browser } from '$app/env';
import { writable } from 'svelte/store';
import type { Action } from './types';

// Action that sets up a focustrap

interface ScrollLockState {
	isLocked: boolean;
	paddingRight: string;
	overflow: string;
	depth: number;
}

function createScrollLockStore() {
	const { subscribe, set, update } = writable<ScrollLockState>({
		isLocked: false,
		paddingRight: '',
		overflow: '',
		depth: 0
	});

	const restore = () => {
		update((state) => {
			console.log('[scrollLock]', 'restoring scroll lock', { state });
			document.body.style.paddingRight = state.paddingRight;
			document.body.style.overflow = state.overflow;
			return {
				isLocked: false,
				paddingRight: '',
				overflow: '',
				depth: 0
			};
		});
	};

	const inc = () => {
		update((state) => {
			return {
				...state,
				depth: state.depth + 1
			};
		});
	};

	const dec = () => update((state) => ({ ...state, depth: state.depth - 1 }));

	return {
		subscribe,
		set,
		toggle: () => update((s) => ({ ...s, isLocked: !s.isLocked })),
		reset: () => update((s) => ({ ...s, isLocked: false })),
		inc,
		dec,
		restore,
		update
	};
}

export const scrollLockState = createScrollLockStore();

export default (node: HTMLElement): ReturnType<Action> => {
	let _state: ScrollLockState | undefined;

	const unsubscribeState = scrollLockState.subscribe((state) => {
		_state = state;
	});

	// this shouldn't happen, hopefully
	if (!_state) return {};

	console.log('opening', { _state });

	if (_state.depth === 0) {
		console.log('_state depth 0');
		const ownerDocument = node.ownerDocument;
		const documentElement = ownerDocument.documentElement;
		console.log('_state setting up scroll lock');
		const overflow = documentElement.style.overflow;
		const paddingRight = documentElement.style.paddingRight;
		console.log('_state', { overflow, paddingRight });
		const scrollbarWidthBefore = window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.overflow = 'hidden';

		if (scrollbarWidthBefore > 0) {
			const scrollbarWidthAfter = documentElement.clientWidth - documentElement.offsetWidth;
			const scrollbarWidth = scrollbarWidthBefore - scrollbarWidthAfter;
			documentElement.style.paddingRight = `${scrollbarWidth}px`;
		}
		scrollLockState.update((state) => {
			console.log(`_state updating state with padding ${paddingRight} and overflow ${overflow}`);
			return {
				...state,
				paddingRight,
				overflow
			};
		});
	}
	scrollLockState.inc();

	return {
		destroy: () => {
			scrollLockState.dec();
			console.log('closing', { _state });
			if (_state?.depth === 0 && browser) {
				console.log('attempting to restore with _state', { _state });
				document.documentElement.style.overflow = _state?.overflow;
				document.documentElement.style.paddingRight = _state?.paddingRight;
				// scrollLockState.restore(); // (this wasn't working; i'm not sure why)
			}
			unsubscribeState();
		}
	};
};
