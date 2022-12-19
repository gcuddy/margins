import $normalizeUrl, { type Options } from 'normalize-url';

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	if (value === null || value === undefined) return false;
	return true;
}

export function normalizeUrl(url: string, options?: Options) {
	const normalized = $normalizeUrl(url, {
		stripWWW: false,
		removeTrailingSlash: false,
		...options,
	});
	console.log({ normalized });
	return normalized;
}

const xmlMimeTypes = ['application/rss+xml', 'application/atom+xml', 'text/xml', 'application/xml'];
export const isXml = (type: string) => xmlMimeTypes.some((t) => type.trim().includes(t));

const jsonMimeTypes = ['application/feed+json', 'application/json'];
export const isJson = (type: string) => jsonMimeTypes.some((t) => type.trim().includes(t));
const linkTypes = [
	'application/rss+xml',
	'application/atom+xml',
	'application/feed+json',
	'application/json',
];
export const linkSelectors = linkTypes
	.map((lt) => `link[rel="alternate"][type="${lt}"]`)
	.join(', ');

function isRelativeUrl(str: string) {
	return !/^https?:\/\//i.test(str);
}
export function resolveUrl(origin: string, url: string) {
	if (isRelativeUrl(url)) {
		return new URL(url, normalizeUrl(origin)).href;
	}
	return url;
}
export const getText = (...items: any): string => {
	for (const item of items) {
		if (typeof item === 'string') {
			return item;
		}
		if (item?.['#text']) {
			return item['#text'] as string;
		}
		if (Array.isArray(item)) {
			return item.map((i) => getText(i)).join(', ') as string;
		}
	}
	return '';
};

export const getLink = (link: any, ...rel: (string | undefined)[]) => {
	if (typeof link === 'string') {
		return link;
	}
	if (link?.href) {
		return link.href;
	}
	if (Array.isArray(link)) {
		if (rel.length) {
			for (const option of rel) {
				const _rel = link.find((l) => l.rel === option)?.href;
				if (_rel) {
					return _rel;
				}
			}
		} else {
			return link[0].href;
		}
	}
	return '';
};
