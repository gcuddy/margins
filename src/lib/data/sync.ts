import { cachedArticlesStore } from '$lib/stores/cache';
import type { Article, RssFeed, Tag } from '@prisma/client';
import dayjs from 'dayjs';
import { derived, get, writable, type Writable } from 'svelte/store';

import { set as setIdb, get as getIdb } from 'idb-keyval';
import { browser } from '$app/env';

interface Cache {
	lastUpdate: number;
}

interface CachedSubscriptions extends Cache {
	subscriptions: RssFeed[];
}
interface CachedTags {
	lastUpdate: number;
	tags: Tag[];
}

export const tagsStore = writable<Tag[]>([]);
if (browser) {
	getIdb('tags')
		.then((val) => {
			console.log('[idb]', 'tags', val);
			if (val) {
				tagsStore.set(val);
			}
		})
		.catch((e) => {
			console.error(e);
		});
}
export const subscriptionsStore = writable<RssFeed[]>([]);
if (browser) {
	getIdb('subscriptions')
		.then((val) => {
			console.log('[idb]', 'subscriptions', val);
			if (val) {
				subscriptionsStore.set(val);
			}
		})
		.catch((e) => {
			console.error(e);
		});
}

export async function getTags() {
	console.log('getting tags');
	const cachedTags = await getIdb('tags');

	if (
		cachedTags?.lastUpdate &&
		dayjs(cachedTags?.lastUpdate).isAfter(dayjs().subtract(1, 'minute'))
	) {
		console.log('using cached tags', console.log({ cachedTags }));
		return cachedTags?.tags;
	} else {
		const res = await fetch(`/api/tags`);
		console.log({ res });
		const tags = await res.json();
		console.log({ tags });
		tagsStore.update(($tagStore) => {
			return tags;
		});
		console.log('updated tagsStore');
		return tags;
	}
}
export async function getSubscriptions() {
	console.log('getting subscriptions');
	const cachedSubscriptions = await getIdb<CachedSubscriptions | undefined>('subscriptions');

	if (
		cachedSubscriptions?.lastUpdate &&
		dayjs(cachedSubscriptions?.lastUpdate).isAfter(dayjs().subtract(1, 'minute'))
	) {
		console.log('using cached subscriptions', console.log({ cachedSubscriptions }));
		return cachedSubscriptions?.subscriptions;
	} else {
		const res = await fetch(`/api/subscriptions.json`);
		console.log({ res });
		const subscriptions = await res.json();
		subscriptionsStore.set(subscriptions);
		console.log('updated subscriptionsStore');
		return subscriptions;
	}
}

// returns a store that will contain articles
// (that way we can update asynchronously)
export async function getArticles(): Promise<Article[]> {
	// check cache and optimisticlly give that first
	// TODO: make this into a class to store state so that we can just stay subscribed?
	const cachedArticles = await getIdb('cached-articles');
	console.log({ cachedArticles });
	// if lastUpdate is less than a minute old
	if (
		cachedArticles &&
		cachedArticles?.lastUpdate &&
		Date.now() - cachedArticles.lastUpdate.getTime() < 60 * 1000
	) {
		console.log('using cached articles');
		return cachedArticles.articles;
	}
	// if it's too old (more than 1 minute old) fetch new version
	console.log('fetching articles from server');
	const res = await fetch(`/api/articles?fields=id,title,author,readProgress,url,description`);
	const { articles } = await res.json();
	cachedArticlesStore.set({
		lastUpdate: new Date(),
		articles
	});
	console.log('updated cachedarticlestore', { articles });
	return articles;
}
// TODO: maybe this should be a class?
