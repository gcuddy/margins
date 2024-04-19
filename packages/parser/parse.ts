import { getHtml } from './lib/fetch-html.js';
import { parse } from 'node-html-parser';
import { getSchemaOrgArticle } from './lib/jsonld.js';
import {
	getAuthorFromSchema,
	getImageFromSchema,
} from './schemas/schemaorg.js';
import { getExtractor } from './lib/get-extractor.js';
import { getFirstMatchingElement } from './lib/utils.js';

type ArticleProps = {
	url: string;
};

// TODO: make it so that it can use node-html-parser or browser's DOMParser, both implement the same API
// TODO: make work in browser too for chrome extension

type Article = {
	author: string;
	html: string;
	image: string;
	published: Date;
	summary: string;
	text: string;
	title: string;
	url: string;
	wordCount: number;
};

export async function parseArticle({ url }: ArticleProps): Promise<Article> {
	const html = await getHtml(url);

	const parser = getParser();
	const root = parser(html);

	// TODO: check if there's a custom extractor, like substack.
	const extractor = getExtractor(url);
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
			returnHtml = el.outerHTML;
			returnText = el.innerText;
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

	console.log(article);

	return {
		...article,
		wordCount: article.wordCount || countWords(article.text),
	};
}

function countWords(str: string) {
	return str.trim().split(/\s+/).length;
}

function getParser() {
	return parse;
}
