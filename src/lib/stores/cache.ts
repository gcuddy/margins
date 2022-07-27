import { browser } from '$app/env';
import type { Article } from '@prisma/client';
import { derived, writable } from 'svelte/store';

import { get, set, update } from 'idb-keyval';

// use last updated to only fetch latest
// use a filter to filter out deleted

// create custom store

// TODO help me!
// maybe same limited subset of articles (ie don't need content)
// is this redundant to do this AND service worker?

interface Cache {
	lastUpdate: Date;
	articles: Article[];
}

let cachedArticles: Cache | null = null;
if (browser) {
	get('cached-articles').then((val) => {
		cachedArticles = val;
	});
	// this is my advanced version lol
	// update<Cache>('cached-articles', (val) => {
	// 	// const url = new URL('/api/articles', window.location.origin);
	// 	const date = new Date();
	// 	fetch(
	// 		`/api/articles?date=${
	// 			val?.lastUpdate ? encodeURIComponent(val?.lastUpdate.toISOString()) : ''
	// 		}`,
	// 		{
	// 			headers: {
	// 				Accept: 'application/json'
	// 			}
	// 		}
	// 	)
	// 		.then((res) => {
	// 			return res.json();
	// 		})
	// 		.then((articles) => {
	// 			if (val?.articles) {
	// 				// replace val.articles with ids that are in articles with their new version
	// 				val.articles.forEach((article) => {
	// 					const newArticle = articles.find((a: Article) => a.id === article.id);
	// 					if (newArticle) {
	// 						article = newArticle;
	// 					}
	// 				});
	// 				val.articles = [...val.articles, ...articles];
	// 				val.lastUpdate = date;
	// 				console.log('does this come first');
	// 				cachedArticles = val;
	// 			}
	// 		});
	// 	console.log('or does this');
	// 	cachedArticles = val ? val : null;
	// 	return {
	// 		...val
	// 	} as Cache;
	// });
}

export const cachedArticlesStore = writable<Cache | null>(cachedArticles);
export const cachedArticlesArray = derived(
	cachedArticlesStore,
	($cachedArticles) => $cachedArticles?.articles
);

if (browser) {
	cachedArticlesStore.subscribe(async (val) => {
		console.log('cachedArticlesStore', val);
		await set('cached-articles', val);
	});
}
