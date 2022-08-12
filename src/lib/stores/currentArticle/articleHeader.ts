import { writable } from 'svelte/store';

export default writable<HTMLElement | null>(null);
