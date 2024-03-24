import { writable } from "svelte/store";

import { createLocalStorageStore } from "$lib/stores/local-storage";

export const localFileNames = writable<Array<string>>([]);

