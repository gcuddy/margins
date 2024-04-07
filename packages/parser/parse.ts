import { getHtml } from './lib/fetch-html.js';
import { parse } from 'node-html-parser';
import { getSchemaOrgArticle } from './lib/jsonld.js';

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

	const articleSchema = getSchemaOrgArticle(root);
	let returnHtml = '';

	if (articleSchema?.hasPart) {
		returnHtml =
			root.querySelector(articleSchema.hasPart.cssSelector)?.outerHTML || '';
	}

	console.log('articleSchema', articleSchema);

	return {
		author: articleSchema?.author || '',
		html: returnHtml,
		image: articleSchema?.image || '',
		published: new Date(articleSchema?.datePublished || ''),
		summary: articleSchema?.description || '',
		text: '',
		title: articleSchema?.headline || '',
		url: articleSchema?.url || '',
		wordCount: articleSchema?.wordcount || 0,
	};
}

function getParser() {
	return parse;
}
