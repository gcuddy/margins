import { writable } from "svelte/store";

export const localFileNames = writable<string[]>([]);
