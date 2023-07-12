import GenericCommandPalette from '$lib/components/CommandPalette/GenericCommandPalette.svelte';
import type { SvelteComponent } from 'svelte';

export interface StoredComponent {
	component: SvelteComponentWithProps<any>;
	props?: Record<string, unknown>;
	slots?: Record<string, StoredComponent>;
}

export interface StoredComponentTyped<T> {
	component: SvelteComponentWithProps<T>;
	props?: T;
}
export type SvelteComponentWithProps<T> = new (...args: any) => SvelteComponent<T>;

export type ComponentProperties<T extends { $set: (...args: any) => any }> = NonNullable<
	Parameters<T['$set']>[0]
>;
