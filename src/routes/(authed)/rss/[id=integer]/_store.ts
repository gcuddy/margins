import type { RssItemWithFeed } from '$lib/types/rss';
import { writable } from 'svelte/store';

export const currentItem = writable<RssItemWithFeed | null>(null);
