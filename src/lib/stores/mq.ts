// credit https://github.com/the-pudding/svelte-starter/blob/main/src/stores/mq.js

import { browser } from "$app/environment";
import { readable } from "svelte/store";

// REVIEW: these should match with Tailwind... how to automate?
const queries = {
	"sm": "(min-width: 640px)",
	"md": "(min-width: 768px)",
	"lg": "(min-width: 1024px)",
	"xl": "(min-width: 1280px)",
	"2xl": "(min-width: 1536px)",
	"reducedMotion": "(prefers-reduced-motion: reduce)",
	"desktop": "(hover: hover) and (pointer: fine)"
} as const;

type MQ = Record<string, MediaQueryList>;

function calculateMedia(mqls: MQ) {
	const media = { classNames: "" } as Record<string | keyof typeof queries, string>;
	const mediaClasses = [];
	// let name: keyof typeof queries;
	for (let name in mqls) {
		media[name] = mqls[name].matches;
		if (media[name]) mediaClasses.push(`mq-${name}`);
	}
	media.classNames = mediaClasses.join(" ");
	return media;
}

export default readable({}, (set) => {
	if (!browser) return;
	const mqls: MQ = {};
	const onChange = () => set(calculateMedia(mqls));

	if (browser) {
		let q: keyof typeof queries;
		for (q in queries) {
			mqls[q] = window.matchMedia(queries[q]);
			// mqls[q].addListener(onChange);
			mqls[q].addEventListener("change", onChange)
		}

		onChange();
	}

	return () => {
		for (let q in mqls) {
			mqls[q].removeEventListener("change", onChange);
		}
	};
});