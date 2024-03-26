import { browser } from '$app/environment';
import { derived } from 'svelte/store';
import scrollY from './scrollY';

let ticking = false;
let lastScrollY = 0;
let down = true;

export default derived(scrollY, ($scrollY, set) => {
	const updateDown = () => {
		if ($scrollY.y > lastScrollY) {
			down = true;
		} else {
			down = false;
		}
		lastScrollY = $scrollY.y;
		ticking = false;
		set(down);
	};
	if (!ticking && browser) {
		requestAnimationFrame(updateDown);
		ticking = true;
	}
	// return down;

	// requestAnimationFrame(set);
	// lastScrollY = $scrollY.y;
	// return down;
});
