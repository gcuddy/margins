import { writable } from 'svelte/store';

export const show_tooltips = writable<boolean>(false);
export interface Tooltip {
	text: string;
	kbd?: string;
}
