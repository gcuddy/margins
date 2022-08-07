import { browser } from '$app/env';
import { derived, readable, writable } from 'svelte/store';

export const mainEl = writable<HTMLElement>();

export const mainElScroll = derived(
	mainEl,
	($mainEl, set) => {
		if (!mainEl) {
			set({
				y: 0,
				offset: 0,
				down: false
			});
		}
		let ticking = false;
		let lastScrollTop = 0;
		let lastOffset = 0;
		let down = false;

		const updateScrollY = () => {
			console.log(`updateScrollY`);
			set({
				down,
				offset: lastOffset,
				y: lastScrollTop
			});
			ticking = false;
		};

		const onScroll = () => {
			const scrollHeight = $mainEl.scrollHeight - window.innerHeight;
			if ($mainEl.scrollTop > lastScrollTop) {
				down = true;
			} else {
				down = false;
			}
			lastScrollTop = $mainEl.scrollTop;
			if (scrollHeight) {
				lastOffset = lastScrollTop / scrollHeight;
			}
			if (!ticking) {
				requestAnimationFrame(updateScrollY);
				ticking = true;
			}
		};

		if (browser) $mainEl?.addEventListener('scroll', onScroll);

		return () => {
			if (browser) $mainEl?.removeEventListener('scroll', onScroll);
		};
	},
	{
		y: 0,
		offset: 0,
		down: false
	}
);
