import { getHtml } from './lib/fetch-html.js';
import { parse } from 'node-html-parser';

type ArticleProps = {
	url: string;
};

// TODO: make it so that it can use node-html-parser or browser's DOMParser, both implement the same API
// TODO: make work in browser too for chrome extension

export async function parseArticle({ url }: ArticleProps) {
	const html = await getHtml(url);

	const parser = getParser();
	const root = parser(html);

	const title = root.querySelector('title')?.text;

	return {
		title,
		url,
	};
}

function getParser() {
	return parse;
}
