import { writable } from "svelte/store";

export const reading_sidebar = writable({
	active: false,
	width: 428,
});
