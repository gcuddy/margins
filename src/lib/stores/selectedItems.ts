import { writable } from 'svelte/store';

import type { ExtendedAnnotation } from '$lib/annotation';

export const selectedItems = writable<ExtendedAnnotation[]>([]);
