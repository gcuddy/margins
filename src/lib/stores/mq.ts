// from the-pudding/svelte-starter
import { browser } from '$app/env';
import { readable } from 'svelte/store';

const queries = {
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
	lg: '(min-width: 1024x)',
	xl: '(min-width: 1280px)',
	'2xl': '(min-width: 1536px)',
	reducedMotion: '(prefers-reduced-motion: reduce)'
};

function calculateMedia(mqls) {
	const media = { classNames: '' };
	const mediaClasses = [];
	for (const name in mqls) {
		media[name] = mqls[name].matches;
		if (media[name]) mediaClasses.push(`mq-${name}`);
	}
	media.classNames = mediaClasses.join(' ');
	return media;
}

export default readable({}, (set) => {
	if (!browser) return;
	const mqls = {};
	const onChange = () => set(calculateMedia(mqls));

	if (browser) {
		for (const q in queries) {
			mqls[q] = window.matchMedia(queries[q]);
			mqls[q].addListener(onChange);
		}

		onChange();
	}

	return () => {
		for (const q in mqls) {
			mqls[q].removeListener(onChange);
		}
	};
});
