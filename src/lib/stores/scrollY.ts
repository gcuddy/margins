// https://github.com/the-pudding/svelte-starter/blob/main/src/stores/scrollY.js
import { browser } from '$app/environment';
import { readable } from 'svelte/store';

export default readable(
	{
		y: 0,
		offset: 0,
		down: false,
	},
	(set) => {
		let ticking = false;
		let lastScrollY = 0;
		let lastOffset = 0;
		let down = false;

		const updateScrollY = () => {
			set({
				y: lastScrollY,
				offset: lastOffset,
				down,
			});
			ticking = false;
		};

		const onScroll = () => {
			console.log(`onScroll`);
			const scrollHeight = document.body.scrollHeight - window.innerHeight;
			if (window.scrollY > lastScrollY) {
				down = true;
			} else {
				down = false;
			}
			lastScrollY = window.scrollY;
			if (scrollHeight) {
				lastOffset = lastScrollY / scrollHeight;
			}
			if (!ticking) {
				requestAnimationFrame(updateScrollY);
				ticking = true;
			}
		};

		if (browser) document.addEventListener('scroll', onScroll);

		return () => {
			if (browser) document.removeEventListener('scroll', onScroll);
		};
	}
);
