import type { Snippet } from 'svelte';

const as = ['span', 'div', 'label', 'p'] as const;
const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export type Props = {
	as: (typeof as)[number];
	children: Snippet;
	size: (typeof sizes)[number];
};
