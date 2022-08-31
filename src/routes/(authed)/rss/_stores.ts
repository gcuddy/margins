import type { RssFeed } from '@prisma/client';
import { derived, writable } from 'svelte/store';

export const feedStore = writable<RssFeed[]>([]);
// Set<RssFeed['uuid']
export const subscribedFeedIds = derived(feedStore, ($feeds) => $feeds.map(({ uuid }) => uuid));
