import parse from 'node-html-parser';
import { parseArticle as $parseArticle, type ParseProps } from './parse.js';

export * from './dom-parser.js';
export * from './schemas/article.js';

export function parseArticle(props: ParseProps) {
	const bound = $parseArticle.bind(null, parse);
	return bound(props);
}
