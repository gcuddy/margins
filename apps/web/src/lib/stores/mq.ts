// credit https://github.com/the-pudding/svelte-starter/blob/main/src/stores/mq.js

import { readable } from "svelte/store";

import { browser } from "$app/environment";

// REVIEW: these should match with Tailwind... how to automate?
const queries = {
	"2xl": "(min-width: 1536px)",
	"desktop": "(hover: hover) and (pointer: fine)",
	"lg": "(min-width: 1024px)",
	"max_lg": "(max-width: 1024px)",
	"max_md": "(max-width: 768px)",
	"max_sm": "(max-width: 640px)",
	"md": "(min-width: 768px)",
	"reducedMotion": "(prefers-reduced-motion: reduce)",
	"sm": "(min-width: 640px)",
	"xl": "(min-width: 1280px)"
} as const;

type MQ = Record<string, MediaQueryList>;

function calculateMedia(mqls: MQ) {
	const media = { classNames: "" } as Record<string | keyof typeof queries, string>;
	const mediaClasses = [];
	// let name: keyof typeof queries;
	for (const name in mqls) {
		media[name] = mqls[name].matches;
		if (media[name]) {mediaClasses.push(`mq-${name}`);}
	}
	media.classNames = mediaClasses.join(" ");
	return media;
}

export default readable<Record<keyof typeof queries, boolean>>({}, (set) => {
	if (!browser) {return;}
	const mqls: MQ = {};
	const onChange = () => { set(calculateMedia(mqls)); };

	if (browser) {
		let q: keyof typeof queries;
		for (q in queries) {
			mqls[q] = window.matchMedia(queries[q]);
			// mqls[q].addListener(onChange);
			mqls[q]?.addEventListener('change', onChange);
		}

		onChange();
	}

	return () => {
		for (const q in mqls) {
			mqls[q]?.removeEventListener('change', onChange);
		}
	};
});
