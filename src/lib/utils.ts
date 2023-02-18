// import { finder } from '@medv/finder';
import type { Annotation, Entry, PodcastEpisode, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { Md5 } from "ts-md5";
import { z } from "zod";

import { browser } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";
import { type INotification, notifications } from "$lib/stores/notifications";

import { syncStore } from "./stores/sync";
import { user } from "./stores/user";
import type { ArticleInList, DomMeta } from "./types";
import type { AnnotationSchema } from "./types/schemas/Annotations";
import type { FavoriteSchema } from "./types/schemas/Favorite";
import type { AddToListSchema } from "./types/schemas/List";
import type { RssFeedItemModel } from "./types/schemas/rssfeeditem";
import type { ViewOptions } from "./types/schemas/View";
import type { RouterOutputs } from "./trpc/router";
// import getCssSelector from 'css-selector-generator';

export function post(endpoint, data) {
	return fetch(endpoint, {
		method: "POST",
		// credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then((r) => r.json());
}
export function put(endpoint: string, data: any) {
	return fetch(endpoint, {
		method: "PUT",
		// credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	}).then((r) => r.json());
}
export function patch(endpoint: string, data: any, notification?: string | INotification) {
	return fetch(endpoint, {
		method: "PATCH",
		// credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then((r) => {
		if (notification && typeof notification === "string") {
			notifications.notify({
				message: notification,
				type: "success",
			});
		} else if (notification && typeof notification !== "string") {
			notifications.notify(notification);
		}
		return r;
	});
}

export function bulkEditArticles(ids: number[], data: Prisma.ArticleUpdateInput) {
	return patch("/api/bulk", { ids, data }).then((res) => {
		console.log({ res });
		return res;
	});
}

export function getSelectionHtml() {
	let html = "";
	if (browser) {
		if (typeof window.getSelection != "undefined") {
			const sel = window.getSelection();
			if (sel?.rangeCount) {
				const container = document.createElement("div");
				for (let i = 0, len = sel.rangeCount; i < len; ++i) {
					container.appendChild(sel.getRangeAt(i).cloneContents());
				}
				html = container.innerHTML;
			}
		}
		return html;
	}
}
export async function processSelection(root?: HTMLElement): {
	html: string;
	nonTextNodes: Selector[];
	selectors: Selector[];
} {
	let html = "";
	const nonTextNodes: Selector[] = [];
	const selectors: Selector[] = [];
	let range: Range;
	const nonTextTags = ["img", "video", "audio", "iframe", "object", "embed", "canvas", "svg"];
	if (typeof window.getSelection != "undefined") {
		const sel = window.getSelection();
		if (sel) {
			// const rawSelectors = await describeCurrentSelection(sel, root);
			// if (rawSelectors) selectors.push(...rawSelectors);
		}
		const startEl = sel?.anchorNode?.parentElement;
		console.log({ root });
		const cssSelector = "";
		console.log({ cssSelector });
		if (sel?.rangeCount) {
			range = sel.getRangeAt(0);
			const textQuote = await describeTextQuote(range, root);
			console.log({ textQuote });
			const container = document.createElement("div");
			container.appendChild(range.cloneContents());
			html = container.innerHTML;
			const nonTextEls = container.querySelectorAll(nonTextTags.join(","));
			if (nonTextEls.length) {
				nonTextEls.forEach((el) => {
					const elementList = (root || document).getElementsByTagName(el.tagName);
					const index = Array.from(elementList).findIndex((e) => e.isEqualNode(el));
					nonTextNodes.push({
						$node: elementList[index],
						tagName: el.tagName,
						index,
						selector: finder(elementList[index]),
					});
				});
			}
		}
	}
	return { html, nonTextNodes, range, selectors };
}

export function replaceRange(s: string, start: number, end: number, substitute: string) {
	return s.substring(0, start) + substitute + s.substring(end);
}

export function formDataToJson(formData: FormData): Record<string, unknown> {
	const data: Record<string, unknown> = {};
	console.log({ formData });
	for (const key in formData) {
		if (formData.has(key)) {
			data[key] = formData.get(key);
		}
	}
	console.log({ data });
	return data;
}

export function parseBracketNotatin(str: string) {
	const regex = /\[(.*?)\]/g;
	const matches = str.match(regex);
	if (matches) {
		return matches.map((m) => m.replace(/\[|\]/g, ""));
	}
	return [];
}

// this is a naive regex that only gets the last instance of eg key[1][value], won't work with multiple nesting
const keyRegex = /^(.*?)\[(\d)\]\[(.*?)\]/;
export async function getJsonFromRequest(request: Request): Promise<Record<string, any>> {
	const contentType = request.headers.get("content-type");
	console.log({ contentType });
	if (contentType?.includes("application/json")) {
		console.log("json");
		return await request.json();
	} else if (
		contentType?.includes("multipart/form-data") ||
		contentType?.includes("application/x-www-form-urlencoded")
	) {
		console.log("requesting form data");
		const formData = await request.formData();
		const data: Record<string, string | Blob | (string | Blob)[]> = {};

		formData.forEach((val, key, p) => {
			if (!val) return;
			console.log({ val, key, p });
			if (Array.isArray(data[key])) {
				data[key] = [...(data[key] as (string | Blob)[]), val];
			} else if (data[key] && !Array.isArray(data[key])) {
				const oldVal = data[key] as string | Blob;
				data[key] = [oldVal, val];
			} else if (key.includes("[]")) {
				const keyWithoutBrackets = key.replace("[]", "");
				if (!data[keyWithoutBrackets]) {
					data[keyWithoutBrackets] = [val];
				} else {
					data[keyWithoutBrackets] = [...(data[keyWithoutBrackets] as (string | Blob)[]), val];
				}
			} else if (keyRegex.test(key)) {
				const [, keyWithoutBrackets, idx, nestedKey] = keyRegex.exec(key);
				if (!data[keyWithoutBrackets]) {
					data[keyWithoutBrackets] = [];
					data[keyWithoutBrackets][Number(idx)] = { [nestedKey]: val };
				} else {
					data[keyWithoutBrackets][Number(idx)] = {
						...data[keyWithoutBrackets][Number(idx)],
						[nestedKey]: val,
					};
				}
			} else {
				data[key] = val;
			}
		});
		console.log({ data });
		return data;
		// return formDataToJson(await request.formData());
	} else {
		const text = await request.text();
		return text;
		// return qs.parse(text);
	}
}

export function getHostname(url: string) {
	try {
		const u = new URL(url).hostname;
		return u;
	} catch (e) {
		return "";
	}
}

export function convertDomMetaToCssSelector(meta: DomMeta) {
	return `${meta.parentTagName}:nth-of-type(${meta.parentIndex})`;
}

const cssSelectorRegex = /[A-z]*[0-9]*?:nth-of-type\([0-9]+\)/;
const cssSelectorMeta = z.string().regex(cssSelectorRegex);

export function convertCssSelectorToDomMeta(
	rawCssSelector: z.infer<typeof cssSelectorMeta>
): Partial<DomMeta> | undefined {
	try {
		const cssSelector = cssSelectorMeta.parse(rawCssSelector);
		const matches = cssSelectorRegex.exec(cssSelector);
		if (matches) {
			return {
				parentTagName: matches[1],
				parentIndex: parseInt(matches[2]),
			};
		}
	} catch (e) {
		console.error(e);
		throw Error("Improper css selector provided");
	}
}

// async function describeCurrentSelection(
// 	sel?: Selection,
// 	root?: HTMLElement
// ): Promise<Selector[] | undefined> {
// 	if (typeof window.getSelection === 'undefined') return;
// 	if (!sel) sel = window.getSelection() || undefined;
// 	const userSelection = sel?.getRangeAt(0);
// 	if (!userSelection || userSelection.collapsed) return;
// 	const selectors: Selector[] = [];
// 	selectors.push(await describeTextQuote(userSelection, root));
// 	selectors.push(await describeTextPosition(userSelection, root));
// 	if (sel?.anchorNode) {
// 		let startEl: HTMLElement | null = null;
// 		if (sel.anchorNode instanceof HTMLElement) startEl = sel.anchorNode;
// 		else if (sel.anchorNode?.parentElement) startEl = sel.anchorNode.parentElement;
// 		if (startEl) {
// 			// selectors.push(await describeCss(startEl, root));
// 			// todo: refactor
// 			let endEl: HTMLElement | null = null;
// 			if (sel.focusNode instanceof HTMLElement) endEl = sel.focusNode;
// 			else if (sel.focusNode?.parentElement) endEl = sel.focusNode.parentElement;
// 			if (endEl) {
// 				// return range Selector
// 				// TODO: extend CssSelector interface with optional textoffset, getting using web-highlighter technique
// 				const start = await describeCss(startEl, root);
// 				const rangeSelector: RangeSelector = {
// 					type: 'RangeSelector',
// 					// todo: refined by offset in each ??
// 					startSelector: {
// 						...start,
// 						refinedBy: await describeTextPosition(userSelection, startEl)
// 					}, // refined by: text position (but just keeping start/end same?)
// 					endSelector: await describeCss(endEl, root)
// 					// refinedBy:
// 				};
// 				console.log({ rangeSelector });
// 			} else {
// 				// return regular selector
// 			}
// 		}
// 	}
// 	return [...selectors];
// }

// export const createMatcher = makeRefinable((selector) => {
// 	// const innerCreateMatcher = {
// 	// 	TextQuoteSelector: createTextQuoteSelectorMatcher,
// 	// 	TextPositionSelector: createTextPositionSelectorMatcher,
// 	// 	RangeSelector: makeCreateRangeSelectorMatcher(createMatcher)
// 	// }[selector.type];
// 	// this isn't working
// 	return;
// 	if (!innerCreateMatcher) {
// 		throw new Error(`Unsupported selector type: ${selector.type}`);
// 	}

// 	return innerCreateMatcher(selector);
// });

export function getNthValueOfSet<T>(set: Set<T>, n: number): T | undefined {
	const values = [...set];
	return values[n];
}

/**
 *
 * @param ids array of article ids to archive
 * @param go where to go after archiving. if null will stay in place.
 * @param inv the route to invalidate. defaults to go. if that's null, defaults to "/".
 */
export const archive = async (ids: number[], go: string | null = "/", inv = go, notify = true) => {
	const { articles } = await bulkEditArticles(ids, {
		location: "ARCHIVE",
	});
	// disable save scroll so we don't save our scroll position anymore
	// disableSaveScroll = true;
	await invalidateAll();
	if (go) {
		goto(go);
	}
	if (notify) {
		const length: number = articles.length;
		notifications.notify({
			title: `Article${ids.length > 1 ? "s" : ""} archived`,
			message: `Archived article${length > 1 ? "s" : ""} ${articles
				.slice(0, 2)
				.map((a) => '<a href="' + a.id + '" class="font-medium">' + a.title + "</a>")
				.join(", ")}${length > 3 ? "and " + (length - 3) + " others" : ""}`,
		});
	}
};

// note: this isn't foolproof, but it works for our simple needs
export function isTouchDevice() {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export async function postAnnotation(annotation: z.infer<typeof AnnotationSchema>) {
	const id = syncStore.addItem();
	const res = await fetch("/annotations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(annotation),
	});
	syncStore.removeItem(id);
	return res;
}

export async function createFavorite(data: z.infer<typeof FavoriteSchema>) {
	const id = syncStore.addItem();
	const res = await fetch("/api/favorites.json", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	user.updateData("favorites");
	syncStore.removeItem(id);
	return res;
}
export async function deleteFavorite(data: { id: number }) {
	const id = syncStore.addItem();
	const res = await fetch("/api/favorites.json", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	user.updateData("favorites");

	syncStore.removeItem(id);
	return res;
}

export function sortArticles<T>(articles: ArticleInList[], opts: ViewOptions) {
	const sortBy = opts.sort;
	return [...articles].sort((a, b) => {
		switch (sortBy) {
			case "title":
				return a.title.localeCompare(b.title);
			case "date": {
				return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1;
			}
			case "author": {
				return a.author.localeCompare(b.author);
			}
			case "createdAt": {
				console.log({ a, b });
				return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1;
			}
			case "updatedAt": {
				return dayjs(a.updatedAt).isBefore(dayjs(b.updatedAt)) ? 1 : -1;
			}
			case "manual": {
				return b.position - a.position;
			}
			default:
				return 0;
		}
	});
}

export function sortFeedItems<T>(items: z.infer<typeof RssFeedItemModel>[], opts: ViewOptions) {
	const sortBy = opts.sort;
	return [...items].sort((a, b) => {
		switch (sortBy) {
			case "title":
				return a.title.localeCompare(b.title);
			case "date": {
				return dayjs(a.pubDate).isBefore(dayjs(b.pubDate)) ? 1 : -1;
			}
			case "author": {
				return a.author.localeCompare(b.author);
			}
			case "createdAt": {
				console.log({ a, b });
				return dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1;
			}
			case "updatedAt": {
				return dayjs(a.updatedAt).isBefore(dayjs(b.updatedAt)) ? 1 : -1;
			}
			default:
				return 0;
		}
	});
}

/**
 * Clamp `num` to the range `[min, max]`
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
export function clamp(num: number, min: number, max: number) {
	return num < min ? min : num > max ? max : num;
}

export async function addToList(listId: number, data: z.infer<typeof AddToListSchema>) {
	const id = syncStore.addItem();
	const res = await fetch(`/lists/${listId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	syncStore.removeItem(id);
	return res;
}

export function createEpisodeHash(data: Partial<PodcastEpisode>) {
	return Md5.hashStr(data.podcastId + data.guid || data.url);
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	if (value === null || value === undefined) return false;
	return true;
}

export const isEntry = (item: Pick<Partial<Entry>, "author"> | Annotation): item is Entry => {
	return (item as Entry).author !== undefined;
};

export const validUrl = (text: string) => {
	// console.log({ text })
	try {
		const u = new URL(text);
		return u.origin !== null || u.origin !== "null";
	} catch {
		return false;
	}
};

type KeySelector<T> = (item: T) => string;

export function groupBy<T>(array: Iterable<T>, keySelector: KeySelector<T>): Record<string, T[]> {
	return Array.from(array).reduce(
		(acc: Record<string, T[]>, item: T) => {
			const key = keySelector(item);
			if (key in acc) {
				// found key, push new item into existing array
				acc[key].push(item);
			} else {
				// did not find key, create new array
				acc[key] = [item];
			}
			return acc;
		},
		{} // start with empty object
	);
}
