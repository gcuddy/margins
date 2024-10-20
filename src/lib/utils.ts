import type { Annotation, Entry } from '@prisma/client';
import type { DebounceSettings } from 'lodash';
import debounce from 'lodash/debounce';

import { browser } from '$app/environment';

import { syncStore } from './stores/sync';
import { user } from './stores/user';

export async function post(endpoint: string, data: unknown) {
	return fetch(endpoint, {
		// credentials: 'include',
		body: JSON.stringify(data || {}),

		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	}).then((r) => r.json());
}

export async function put(endpoint: string, data: unknown) {
	return fetch(endpoint, {
		// credentials: 'include',
		body: JSON.stringify(data || {}),

		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'PUT',
	}).then((r) => r.json());
}

export async function patch(endpoint: string, data: unknown) {
	return fetch(endpoint, {
		// credentials: 'include',
		body: JSON.stringify(data || {}),

		headers: {
			'Content-Type': 'application/json',
		},
		method: 'PATCH',
	}).then((r) => r.json());
}

export function getSelectionHtml() {
	let html = '';
	if (browser) {
		if (window.getSelection !== undefined) {
			const sel = window.getSelection();
			if (sel?.rangeCount) {
				const container = document.createElement('div');
				for (let i = 0, len = sel.rangeCount; i < len; ++i) {
					container.append(sel.getRangeAt(i).cloneContents());
				}
				html = container.innerHTML;
			}
		}
		return html;
	}
}

export function replaceRange(
	s: string,
	start: number,
	end: number,
	substitute: string,
) {
	return (
		s.slice(0, Math.max(0, start)) + substitute + s.slice(Math.max(0, end))
	);
}

export function formDataToJson(formData: FormData): Record<string, unknown> {
	const data: Record<string, unknown> = {};
	for (const key in formData) {
		if (formData.has(key)) {
			data[key] = formData.get(key);
		}
	}
	return data;
}

export function parseBracketNotatin(str: string) {
	const regex = /\[(.*?)]/g;
	const matches = str.match(regex);
	if (matches) {
		return matches.map((m) => m.replaceAll('[]', ''));
	}
	return [];
}

// this is a naive regex that only gets the last instance of eg key[1][value], won't work with multiple nesting
// const keyRegex = /^(.*?)\[(\d)]\[(.*?)]/;
// export async function getJsonFromRequest(
// 	request: Request,
// ): Promise<Record<string, any>> {
// 	const contentType = request.headers.get('content-type');
// 	console.log({ contentType });
// 	if (contentType?.includes('application/json')) {
// 		console.log('json');
// 		return await request.json();
// 	} else if (
// 		contentType?.includes('multipart/form-data') ||
// 		contentType?.includes('application/x-www-form-urlencoded')
// 	) {
// 		console.log('requesting form data');
// 		const formData = await request.formData();
// 		const data: Record<string, string | Blob | Array<string | Blob>> = {};

// 		formData.forEach((val, key, p) => {
// 			if (!val) {
// 				return;
// 			}
// 			console.log({ key, p, val });
// 			if (Array.isArray(data[key])) {
// 				data[key] = [...(data[key] as Array<string | Blob>), val];
// 			} else if (data[key] && !Array.isArray(data[key])) {
// 				const oldVal = data[key] as string | Blob;
// 				data[key] = [oldVal, val];
// 			} else if (key.includes('[]')) {
// 				const keyWithoutBrackets = key.replace('[]', '');
// 				data[keyWithoutBrackets] = !data[keyWithoutBrackets]
// 					? [val]
// 					: [...(data[keyWithoutBrackets] as Array<string | Blob>), val];
// 			} else if (keyRegex.test(key)) {
// 				const [, keyWithoutBrackets, idx, nestedKey] = keyRegex.exec(key);
// 				if (!data[keyWithoutBrackets]) {
// 					data[keyWithoutBrackets] = [];
// 					data[keyWithoutBrackets][Number(idx)] = { [nestedKey]: val };
// 				} else {
// 					data[keyWithoutBrackets][Number(idx)] = {
// 						...data[keyWithoutBrackets][Number(idx)],
// 						[nestedKey]: val,
// 					};
// 				}
// 			} else {
// 				data[key] = val;
// 			}
// 		});
// 		console.log({ data });
// 		return data;
// 		// return formDataToJson(await request.formData());
// 	} else {
// 		const text = await request.text();
// 		return text;
// 		// return qs.parse(text);
// 	}
// }

export function getHostname(url: string) {
	try {
		const u = new URL(url).hostname;
		return u;
	} catch {
		return '';
	}
}

export function getPathname(url: string) {
	try {
		const u = new URL(url);
		return u.pathname;
	} catch {
		return '';
	}
}

export function getNthValueOfSet<T>(set: Set<T>, n: number): T | undefined {
	const values = [...set];
	return values[n];
}

// note: this isn't foolproof, but it works for our simple needs
export function isTouchDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export async function deleteFavorite(data: { id: number }) {
	const id = syncStore.addItem();
	const res = await fetch('/api/favorites.json', {
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'DELETE',
	});
	user.updateData('favorites');

	syncStore.removeItem(id);
	return res;
}

export function notEmpty<TValue>(
	value: TValue | null | undefined,
): value is TValue {
	if (value === null || value === undefined) {
		return false;
	}
	return true;
}

export const isEntry = (
	item: Pick<Partial<Entry>, 'author'> | Annotation,
): item is Entry => {
	return (item as Entry).author !== undefined;
};

export const isValidUrl = (text: string) => {
	// console.log({ text })
	try {
		const u = new URL(text);
		return u.origin !== null && u.origin !== 'null';
	} catch {
		return false;
	}
};

type KeySelector<T> = (item: T) => string;

export function groupBy<T>(
	array: Iterable<T>,
	keySelector: KeySelector<T>,
): Record<string, Array<T>> {
	return Array.from(array).reduce(
		(acc: Record<string, Array<T>>, item: T) => {
			const key = keySelector(item);
			if (key in acc) {
				// found key, push new item into existing array
				acc[key]?.push(item);
			} else {
				// did not find key, create new array
				acc[key] = [item];
			}
			return acc;
		},
		{}, // start with empty object
	);
}

export const trytm = async <T>(promise: Promise<T>) => {
	try {
		const data = await promise;
		return [data, null] as const;
	} catch (error) {
		return [null, error] as const;
	}
};

export function asyncDebounce<
	// eslint-disable-next-line space-before-function-paren
	F extends (...args: Array<unknown>) => Promise<unknown>,
>(func: F, wait?: number, options?: DebounceSettings) {
	const debounced = debounce(
		(resolve, reject, args: Parameters<F>) => {
			func(...args)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				.then(resolve)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				.catch(reject);
		},
		wait,
		options,
	);
	return (...args: Parameters<F>): ReturnType<F> =>
		new Promise((resolve, reject) => {
			debounced(resolve, reject, args);
		}) as ReturnType<F>;
}

export function word_count(str: string) {
	return str.split(' ').length;
}

export function check_inert(el: HTMLElement) {
	return el.hasAttribute('inert') || el.closest('[inert]') !== null;
}

export function check_inside_input(el = document.activeElement) {
	return el?.closest('input, textarea, [contenteditable]') !== null;
}

export function normalizeCamelCase(str: string, capitalize = true) {
	const words = str.split(/(?=[A-Z])/);
	// make all words first letter lowercase
	const lowercased = words.map(
		(word) => word.charAt(0).toLowerCase() + word.slice(1),
	);
	const normalized = lowercased.join(' ');
	return capitalize
		? normalized.charAt(0).toUpperCase() + normalized.slice(1)
		: normalized;
}

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

import { cn } from './utils/tailwind';

export { cn };

export * from './utils/transition';

export function findClosestImage<
	TObj extends { height: number; width: number },
>(images: Array<TObj>, size: number) {
	let closestImage = images[0];
	if (!closestImage) return null;
	let closestDistance =
		Math.abs(closestImage.height - size) + Math.abs(closestImage.width - size);

	for (let i = 1; i < images.length; i++) {
		const image = images[i];
		if (image) {
			const distance =
				Math.abs(image.height - size) + Math.abs(image.width - size);
			if (distance < closestDistance) {
				closestImage = image;
				closestDistance = distance;
			}
		}
	}

	return closestImage;
}

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get text surrounding the match and highlight it
 */
export function highlightSearchTerm(text: string | null, searchTerm: string, portion = false) {
    const regex = new RegExp(searchTerm, 'gi');
	if (!text) return '';
	if (!portion) {
		return text.replace(regex, `<mark>$&</mark>`);
	}
	const match = regex.exec(text);
	if (!match) return '';
	const start = Math.max(0, match.index - 20);
	const end = Math.min(text.length, match.index + searchTerm.length + 20);
	return (
		'...' +
		text.slice(start, match.index) +
		`<mark>${match[0]}</mark>` +
		text.slice(match.index + searchTerm.length, end) +
		'...'
	);
}
