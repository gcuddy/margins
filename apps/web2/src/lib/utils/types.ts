import type { Snippet } from 'svelte';

export type PropsWithChildren<Props, Parameters extends unknown[] = unknown[]> = Props & {
	children: Snippet<Parameters>;
};
