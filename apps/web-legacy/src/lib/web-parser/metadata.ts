import dayjs from 'dayjs';
import type { HTMLElement } from 'node-html-parser';
import type { ImageObject } from 'schema-dts';
import { extractFromSelectors, findMeta } from './utils';

export function parseJsonld(root: HTMLElement) {
	const jsonld = root.querySelector("script[type='application/ld+json']");
	if (!jsonld) {
		return null;
	}
	const json = jsonld.innerHTML;
	const schema = JSON.parse(json);
	const title = schema.headline?.toString() || schema.name?.toString();
	const description = schema.description?.toString();
	const image =
		typeof schema.image === 'string'
			? schema.image
			: Array.isArray(schema.image)
			? (schema?.image?.[0] as ImageObject)?.url
			: null;
	const date = dayjs(schema.datePublished?.toString()).unix();
	const author =
		typeof schema.author === 'string'
			? schema.author
			: Array.isArray(schema.author)
			? schema.author[0].name
			: typeof schema.author === 'object'
			? schema.author.name.toString()
			: '';
	// TODO: add proper types/make this more robust
	return {
		title,
		description,
		image,
		date,
		author
	};
}

// could use Article | WebPage types from schema-dts, but not sure
function getTitle(root: HTMLElement, metaEls: HTMLElement[], jsonLd?: any) {
	if (jsonLd) {
		const title =
			jsonLd.title?.toString() || jsonLd.headline?.toString() || jsonLd.name?.toString();
		if (title) return title as string;
	}
	const META_TAGS = [
		// in order of priority
		'twitter:title',
		'dc:title',
		'dcterm:title',
		'og:title',
		'title',
		'weibo:article:title',
		'weibo:webpage:title'
	];
	// loop thru meta tags - if we find a match, return that
	for (const name of META_TAGS) {
		const title = findMeta(metaEls, name);
		if (title) return title;
	}
	// if that doesn't work, use some selectors to try to find it
	// TODO: allow this list to be modified/prepended
	const TITLE_SELECTORS = [
		'.hentry .entry-title',
		'h1#articleHeader',
		'h1.articleHeader',
		'h1.article',
		'.instapaper_title',
		'#meebo-title',
		'article h1',
		'#entry-title',
		'.entry-title',
		'#entryTitle',
		'#entrytitle',
		'.entryTitle',
		'.entrytitle',
		'#articleTitle',
		'.articleTitle',
		'post post-title',
		'h1.title',
		'h2.article',
		'h1',
		'html head title',
		'title'
	];
	const title = extractFromSelectors(root, TITLE_SELECTORS, 1);
	if (title) return title;
}

function getDescription(root: HTMLElement, metaEls: HTMLElement[], jsonLd?: any) {
	if (jsonLd) {
		const description = jsonLd.description?.toString();
		if (description) return description as string;
	}
	const META_TAGS = [
		// in order of priority
		'twitter:description',
		'dc:description',
		'dcterm:description',
		'og:description',
		'description',
		'weibo:article:description',
		'weibo:webpage:description'
	];
	// loop thru meta tags - if we find a match, return that
	for (const name of META_TAGS) {
		const description = findMeta(metaEls, name);
		if (description) return description;
	}
}

function getImage(root: HTMLElement, metaEls: HTMLElement[], jsonLd?: any) {
	if (jsonLd) {
		const image =
			jsonLd.image?.toString() ||
			jsonLd.image?.[0]?.url?.toString() ||
			jsonLd.image?.[0]?.url?.[0]?.toString();
		if (image) return image as string;
	}
	const META_TAGS = [
		// in order of priority
		'og:image',
		'twitter:image',
		'image',
		'image_src',
		'weibo:article:image',
		'weibo:webpage:image'
	];
	// loop thru meta tags - if we find a match, return that
	for (const name of META_TAGS) {
		const image = findMeta(metaEls, name);
		if (image) return image;
	}
	// TODO: if that doesn't work, use some selectors to try to find it
	// mercury has a whole process here worth looking into
}

function getAuthor(root: HTMLElement, metaEls: HTMLElement[], jsonLd?: any) {
	// TODO: add author object which contains url, etc
	if (jsonLd) {
		const author = jsonLd.author?.toString() || jsonLd.author?.[0]?.name?.toString();
		if (author) return author as string;
	}
	const META_TAGS = [
		// in order of priority
		'author',
		'dc:creator',
		'dcterm:creator',
		'og:author',
		'twitter:creator',
		'weibo:article:user_id',
		'weibo:webpage:user_id'
	];
	// loop thru meta tags - if we find a match, return that
	for (const name of META_TAGS) {
		const author = findMeta(metaEls, name);
		if (author) return author;
	}
	// TODO: add fallback selectors
}

function getDate(root: HTMLElement, metaEls: HTMLElement[], jsonLd?: any) {
	if (jsonLd) {
		const date = jsonLd.date;
		if (date) return date;
	}
	console.log({ jsonLd });
	const META_TAGS = [
		// in order of priority
		'article:published_time',
		'date',
		'dc:date',
		'dcterm:date'
	];
	// loop thru meta tags - if we find a match, return that
	for (const name of META_TAGS) {
		const date = findMeta(metaEls, name);
		if (date) return dayjs(date).unix();
	}
	// TODO: add fallback selectors
}
export function getMetadata(root: HTMLElement) {
	// TODO: allow custom selectors for websites (for content too);
	const JsonMeta = parseJsonld(root);
	const metaEls = root.querySelectorAll('meta');
	const title = getTitle(root, metaEls, JsonMeta);
	const description = getDescription(root, metaEls, JsonMeta);
	// (if no desc we shuold use first paragraph)
	const image = getImage(root, metaEls, JsonMeta);
	const author = getAuthor(root, metaEls, JsonMeta);
	const date = getDate(root, metaEls, JsonMeta);
	return {
		title,
		description,
		image,
		author,
		date
	};
	// to get: (keywords?)
	// decode html entities?
}
