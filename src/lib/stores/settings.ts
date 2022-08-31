import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// export const darkMode = writable(false);

// these shoudl be stored on server, but for now just stashing in localStorage
// ideally hooks.ts inserts data-theme into the html block
//get rid of local storage thing
let darkModeSetting: string | null = null;
if (browser) {
	darkModeSetting = localStorage.getItem('dark-mode');
}
export const darkMode = writable(
	darkModeSetting ? (JSON.parse(darkModeSetting) as boolean) : false
);
if (browser) {
	darkMode.subscribe((val) => localStorage.setItem('dark-mode', JSON.stringify(val)));
}
