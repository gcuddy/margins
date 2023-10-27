import type { ComponentType } from 'svelte';

export type DocFile = {
	default: ComponentType;
	// TODO
	metadata?: Record<string, any>;
};

export type DocResolver = () => Promise<DocFile>;
