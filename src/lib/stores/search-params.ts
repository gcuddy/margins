import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { defaultParseSearch, defaultStringifySearch } from '$lib/utils/search-params';
import { effect } from '@melt-ui/svelte/internal/helpers';
import { getContext, setContext } from 'svelte';
import { get, Updater, writable, type Writable } from 'svelte/store';
import type { z } from 'zod';

export function createParamsStore<TSchema extends z.ZodObject<any, any>>(
	schema: TSchema
): Writable<z.infer<TSchema>> {
	const store = writable<z.infer<TSchema>>({});

	const unsubPage = page.subscribe(($page) => {
		const rawObj = defaultParseSearch($page.url.search);
		if (!schema) {
			return store.set(rawObj);
		}
		const parsed = schema?.safeParse(rawObj);
		if (parsed.success) {
			return store.set(parsed.data);
		} else {
			return store.set({});
		}
	});

	const subscribe = (...props: Parameters<typeof store.subscribe>) => {
		const unsub = store.subscribe(...props);
		return () => {
			unsub();
			unsubPage();
		};
	};

	effect([store, page], ([$store, $page]) => {
		if (!browser) return;
		console.log({ $store });
		const searchStr = defaultStringifySearch($store);
		// if
		if (searchStr !== $page.url.search) {
			console.log(`Navigating to new search: ${searchStr}`);
			const url = $page.url.pathname + searchStr;
			goto(url, {
				keepFocus: true,
				noScroll: true,
				replaceState: true
			});
		}
	});

	return {
		...store,
		subscribe
	};
}

type SearchParamsStore<TSchema extends z.ZodObject<any, any>> = Writable<z.infer<TSchema>> & {
	change: (cb: (data: z.infer<TSchema>) => z.infer<TSchema>) => void;
	delete: (key: keyof TSchema) => void;
};

export function createSearchParamsStore<TSchema extends z.ZodObject<any, any>>(
	schema: TSchema
): SearchParamsStore<TSchema> {
	const store = writable<z.infer<TSchema>>({});

	const unsubPage = page.subscribe(($page) => {
		const rawObj = defaultParseSearch($page.url.search);
		if (!schema) {
			return store.set(rawObj);
		}
		const parsed = schema?.safeParse(rawObj);
		if (parsed.success) {
			return store.set(parsed.data);
		} else {
			return store.set({});
		}
	});

	const subscribe = (...props: Parameters<typeof store.subscribe>) => {
		const unsub = store.subscribe(...props);
		return () => {
			unsub();
			unsubPage();
		};
	};

	// effect([store, page], ([$store, $page]) => {
	// 	console.log({ $store });
	// 	const searchStr = defaultStringifySearch($store);
	// 	// if
	// 	if (searchStr !== $page.url.search) {
	//         console.log(`Navigating to new search: ${searchStr}`)
	// 		const url = $page.url.pathname + searchStr;
	// 		goto(url, {
	// 			keepFocus: true,
	// 			noScroll: true,
	// 			replaceState: true
	// 		});
	// 	}
	// });

	const change: SearchParamsStore<TSchema>['change'] = (updater) => {
		const searchObj = get(store);
		const $page = get(page);
		const newData = updater(searchObj);
		store.set(newData);
		const newStr = defaultStringifySearch(newData);
		const url = $page.url.pathname + newStr;
		if (browser) {
			goto(url, {
				keepFocus: true,
				noScroll: true,
				replaceState: true
			});
		}
	};
	return {
		...store,
		subscribe,
		change,
		delete: (key) => {
            change(data => {
                delete data[key];
                return data;
            })
        }
	};
}

const CONTEXT_NAME = 'searchParamsStore';

export function setSearchParamsStoreContext<TSchema extends z.ZodObject<any, any>>(
	store: ReturnType<typeof createSearchParamsStore<TSchema>>
) {
	setContext(CONTEXT_NAME, store);
}

export function createSearchParamsStoreContextGetter<TSchema extends z.ZodObject<any, any>>() {
	return () => getContext<ReturnType<typeof createSearchParamsStore<TSchema>>>(CONTEXT_NAME);
}
