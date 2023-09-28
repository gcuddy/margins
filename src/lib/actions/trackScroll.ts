import { debounce } from '@melt-ui/svelte/internal/helpers';
import { writable, type Writable } from 'svelte/store';

const trackScroll = (
	node: HTMLElement,
	stores?: {
		scrollingDown?: Writable<boolean>;
		scroll?: Writable<number>;
		scrolling?: Writable<boolean>;
	}
) => {
	const scrollingDown = stores?.scrollingDown || writable(false);
	const scroll = stores?.scroll || writable(0);
	const scrolling = stores?.scrolling || writable(false);

	let lastScrollTop = 0;
	const setScrollOffset = () => {
		// console.log({ initializing });
		// if (initializing) return;
		// set how far the user has scrolled
		// TODO await tick?
		// TODO This shuoldn't be set if the document is loading (and we scroll to position)
		const scrollTop = node.scrollTop;
		const height = node.scrollHeight - node.clientHeight;
		scroll.set(scrollTop / height);

		// set scrolling direction
		scrollingDown.set(scrollTop > lastScrollTop);
		lastScrollTop = scrollTop;
	};

	const debouncedScroll = debounce(() => {
		scrolling.set(false);
	}, 100);

	function handleScroll(e: Event) {
		scrolling.set(true);
		requestAnimationFrame(setScrollOffset);
		debouncedScroll();
	}

	node.addEventListener('scroll', handleScroll, { passive: true });

	return {
		destroy() {
			node.removeEventListener('scroll', handleScroll);
		}
	};
};

export default trackScroll;
