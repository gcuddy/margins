import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface Dev {
	disableListImgs: boolean;
	keypress: boolean;
	activeElement: boolean;
}

let storedDev: Dev | undefined;

if (browser) {
	const stored = localStorage.getItem('user');
	if (stored) {
		storedDev = JSON.parse(stored);
	}
}

export const dev = writable<Dev>(
	storedDev || {
		disableListImgs: false,
		keypress: false,
		activeElement: false,
	}
);

if (browser) {
	dev.subscribe((value) => (localStorage.user = JSON.stringify(value)));
}
