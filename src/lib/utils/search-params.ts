import type { z } from 'zod';
import { decode, encode } from './qss';
import { goto } from '$app/navigation';

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

const isoRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

export function stringifySearchWith(stringify: (search: any) => string) {
	return (search: Record<string, any>) => {
		search = { ...search };

		if (search) {
			Object.keys(search).forEach((key) => {
				const val = search[key];
				if (typeof val === 'undefined' || val === undefined) {
					delete search[key];
				} else if (val && typeof val === 'object' && val !== null) {
					try {
						search[key] = stringify(val);
					} catch (err) {
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
	schema: TSchema
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
				}
		  ) => TData),
	gotoOptions: Parameters<typeof goto>[1] = {
		keepFocus: true,
		replaceState: true,
		noScroll: true,
		invalidateAll: true
	}
) {
	const exisiting = defaultParseSearch(url.search);
	const newSearch = defaultStringifySearch({
		...exisiting,
		...(typeof data === 'function' ? data(exisiting) : data)
	});
	url.search = newSearch;
	goto(url, gotoOptions);
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
