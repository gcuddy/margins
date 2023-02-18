import { derived, writable } from "svelte/store";

import { browser } from "$app/environment";

export const mainEl = writable<HTMLElement>();

export const mainElScroll = derived(
	mainEl,
	($mainEl, set) => {
		if (!mainEl) {
			set({
				y: 0,
				offset: 0,
			});
		}
		let ticking = false;
		let lastScrollTop = 0;
		let lastOffset = 0;
		let downIncrementer = 0;
		let upIncrementer = 0;
		let down = false;

		const updateScrollY = () => {
			const scrollHeight = $mainEl.scrollHeight - window.innerHeight;
			if ($mainEl.scrollTop > lastScrollTop) {
				//  we do this to only count the scroll down *if* the user is actually scrolling down 10px or more
				// it seems insane, but it works!!
				upIncrementer = 0;
				downIncrementer++;
			} else {
				downIncrementer = 0;
				upIncrementer++;
			}
			if (downIncrementer === 6) {
				down = true;
			} else if (upIncrementer === 6) {
				down = false;
			}
			lastScrollTop = $mainEl.scrollTop;
			if (scrollHeight) {
				lastOffset = lastScrollTop / scrollHeight;
			}
			set({
				offset: lastOffset,
				y: lastScrollTop,
				down,
			});
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateScrollY);
				ticking = true;
			}
		};

		if (browser) $mainEl?.addEventListener("scroll", onScroll);

		return () => {
			if (browser) $mainEl?.removeEventListener("scroll", onScroll);
		};
	},
	{
		y: 0,
		offset: 0,
		down: false,
	}
);

// export const mainElDown = derived(
// 	mainElScroll,
// 	($mainElScroll, set) => {
// 		let lastScrollY = 0;
// 		const scrollY = $mainElScroll.y;
// 		const direction = scrollY > lastScrollY ? true : false;
// 		set(direction);
// 		lastScrollY = scrollY > 0 ? scrollY : 0;
// 	},
// 	false
// );
