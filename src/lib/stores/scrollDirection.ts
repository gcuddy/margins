import { browser } from '$app/environment';
import { readable } from 'svelte/store';

export default function (el: HTMLElement | Window) {
	if (!browser) return;
	console.log({ el });
	const { subscribe } = readable(false, (set) => {
		let lastScrollY = el instanceof HTMLElement ? el.scrollTop : window.scrollY;
		let ticking = false;
		let down = false;

		const updateDirection = () => {
			set(down);
			ticking = false;
		};

		const onScroll = () => {
			console.log('on scrolllll');
			const scrollY = el instanceof HTMLElement ? el.scrollTop : window.scrollY;
			down = scrollY > lastScrollY ? true : false;
			if (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10) {
				if (!ticking) {
					requestAnimationFrame(updateDirection);
					ticking = true;
				}
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
		};
		if (browser) window.addEventListener('scroll', onScroll);
		return () => {
			if (browser) window.removeEventListener('scroll', onScroll);
		};
	});
	return {
		subscribe,
	};
}

function useScrollDirection() {
	const [scrollDirection, setScrollDirection] = useState(null);

	useEffect(() => {
		let lastScrollY = window.pageYOffset;

		const updateScrollDirection = () => {
			const scrollY = window.pageYOffset;
			const direction = scrollY > lastScrollY ? 'down' : 'up';
			if (
				direction !== scrollDirection &&
				(scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
			) {
				setScrollDirection(direction);
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
		};
		window.addEventListener('scroll', updateScrollDirection); // add event listener
		return () => {
			window.removeEventListener('scroll', updateScrollDirection); // clean up
		};
	}, [scrollDirection]);

	return scrollDirection;
}
