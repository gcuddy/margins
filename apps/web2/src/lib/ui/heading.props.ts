import type { Snippet } from 'svelte';

const as = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type Props = {
	as: (typeof as)[number];
	children: Snippet;
};
