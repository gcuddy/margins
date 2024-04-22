import { getHtml } from './lib/fetch-html.js';
import { getSchemaOrgArticle } from './lib/jsonld.js';
import {
	getAuthorFromSchema,
	getImageFromSchema,
} from './schemas/schemaorg.js';
import { getExtractor } from './lib/get-extractor.js';
import { getFirstMatchingElement } from './lib/utils.js';
import type { Parser } from './dom-parser.js';
import type { Article } from './schemas/article.js';
import { cleanBySelectors } from './lib/clean.js';
import { extractAuthor } from './extractors/generic/author/index.js';

export type ParseProps = {
	html?: string;
	url: string;
};

// TODO: make it so that it can use node-html-parser or browser's DOMParser, both implement the same API
// TODO: make work in browser too for chrome extension

export async function parseArticle(
	parser: Parser,
	{ html: _html, url }: ParseProps,
): Promise<Article> {
	const html = _html ?? (await getHtml(url));
	const root = parser.parse(html);

	// TODO: check if there's a custom extractor, like substack.
	const extractor = getExtractor(url, root);
	console.log({ extractor });
	let article: Article = {
		author: '',
		html: '',
		image: '',
		published: new Date(),
		summary: '',
		text: '',
		title: '',
		url: '',
		wordCount: -1,
	};

	let returnHtml = '';
	let returnText = '';
	if (extractor.content) {
		const selectors = Array.isArray(extractor.content)
			? extractor.content
			: extractor.content.selectors;
		const el = getFirstMatchingElement(root, ...selectors);
		if (el) {
			const cleaners = Array.isArray(extractor.content)
				? []
				: extractor.content.clean ?? [];
			cleanBySelectors(el, cleaners);
			returnHtml = el.outerHTML;
			returnText = el.innerText ?? '';
		}
	}

	const articleSchema = getSchemaOrgArticle(root);

	if (!returnHtml && articleSchema?.hasPart) {
		const el = root.querySelector(articleSchema.hasPart.cssSelector);
		returnHtml = el?.outerHTML || '';
		returnText = el?.innerText || '';
	}
	article = {
		...article,
		author: articleSchema
			? getAuthorFromSchema(articleSchema)?.join(', ') ?? ''
			: '',
		html: returnHtml,
		image: articleSchema ? getImageFromSchema(articleSchema)?.[0] ?? '' : '',
		published: new Date(articleSchema?.datePublished || ''),
		summary: articleSchema?.description || '',
		text: returnText,
		title: articleSchema?.headline || '',
		url: articleSchema?.url || '',
		wordCount: articleSchema?.wordcount || countWords(returnText),
	};

	if (!article.author) {
		article.author = extractAuthor(root as HTMLElement) ?? '';
	}

	console.log(article);

	return {
		...article,
		wordCount: article.wordCount || countWords(article.text),
	};
}

function countWords(str: string) {
	return str.trim().split(/\s+/).length;
}
