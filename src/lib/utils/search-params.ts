import type { z } from 'zod';
import { decode, encode } from './qss';
import { goto } from '$app/navigation';
import { objectKeys, replaceEqualDeep } from '$lib/helpers';

export function parseSearchWith(parser: (str: string) => any) {
	return (searchStr: string): {} => {
		if (searchStr.substring(0, 1) === '?') {
			searchStr = searchStr.substring(1);
		}

		let query: Record<string, unknown> = decode(searchStr);

		// Try to parse any query params that might be json
		for (let key in query) {
			const value = query[key];
			if (typeof value === 'string') {
				try {
					query[key] = parser(value);
				} catch (err) {
					//
				}
			}
		}

		return query;
	};
}

const isoRegex =
	/\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

export function stringifySearchWith<TSearch = Record<string, any>>(
	stringify: (search: any) => string,
) {
	return (search: TSearch) => {
		search = { ...search };

		if (search) {
			objectKeys(search).forEach((key) => {
				const val = search[key];
				if (val === undefined) {
					delete search[key];
				} else if (val && typeof val === 'object' && val !== null) {
					try {
						//@ts-expect-error - this is fine
						search[key] = stringify(val);
					} catch {
						// silent
					}
				}
			});
		}

		const searchStr = encode(search as Record<string, string>).toString();

		return searchStr ? `?${searchStr}` : '';
	};
}

export const defaultParseSearch = parseSearchWith(JSON.parse);
export const defaultStringifySearch = stringifySearchWith((search: any) => {
	return JSON.stringify(search, (key, value) => {
		console.log('[stringify]', { key, value });
		if (value instanceof Date) {
			return value.toISOString().slice(0, 10);
		}
		if (typeof value === 'string' && isoRegex.test(value)) {
			return new Date(value).toISOString().slice(0, 10);
		}
		return value;
	});
});

export function parseSearchWithSchema<TSchema extends z.ZodObject<any, any>>(
	search: string,
	schema: TSchema,
): Partial<z.infer<TSchema>> {
	const rawObj = defaultParseSearch(search);
	const parsed = schema.safeParse(rawObj);

	if (parsed.success) {
		return parsed.data;
	} else {
		return {};
	}
}

export function changeSearch<TData extends Record<string, any>>(
	url: URL,
	data:
		| TData
		| ((
				search: Partial<TData> & {
					[key: string]: unknown;
				},
		  ) => TData),
	gotoOptions: Parameters<typeof goto>[1] = {
		keepFocus: true,
		replaceState: true,
		noScroll: true,
		invalidateAll: true,
	},
) {
	const previous = defaultParseSearch(url.search);
	const next = typeof data === 'function' ? data(previous) : data;

	const search = replaceEqualDeep(previous, next);
	const searchStr = defaultStringifySearch(search);
	// console.log(typeof data === 'function' ? data(previous) : data);
	// const newSearch = defaultStringifySearch({
	// 	...previous,
	// 	...(typeof data === 'function' ? data(previous) : data),
	// });

	console.log({ url, searchStr, search, previous, next });
	if (url.search === searchStr) {
		return;
	}
	url.search = searchStr;
	console.log(`[changeSearch] navigating to ${url.toString()}`);
	goto(url.toString(), gotoOptions);
}

/**
 * Helper function to create a typed changeSearch function
 * @returns A function that will change the search params of the current url
 */
export function createChangeSearch<TSchema extends Record<string, any>>() {
	return (...args: Parameters<typeof changeSearch<TSchema>>) => {
		changeSearch(...args);
	};
}
