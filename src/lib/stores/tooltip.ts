import { browser } from '$app/environment';
import type { Annotation, Highlight } from '@prisma/client';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import type { StoredComponent } from './types';

export const tooltip = writable<StoredComponent>(undefined);
export const showTooltip = writable(false);
export const tooltipLoc = writable({ x: 0, y: 0 });
