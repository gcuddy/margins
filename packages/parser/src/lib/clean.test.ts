import { parse } from 'node-html-parser';
import { SubstackParser } from '../extractors/custom/index.js';
import { parseArticle } from '../index.js';
import { getHtml } from './fetch-html.js';

describe('cleaning tests', () => {
	test('Substack cleaners', async () => {
		const urls = [
			'https://www.theborderchronicle.com/p/bridges-or-barricades-debates-in',
			'https://www.theborderchronicle.com/p/border-imperialism-in-the-balkans',
		];
		for (const url of urls) {
			const html = await getHtml(url);
			const article = await parseArticle({ html, url });
			const doc = parse(article.html);
			const cleaners = SubstackParser.content.clean.join(', ');
			const cleaned = doc.querySelectorAll(cleaners);
			expect(cleaned.length).toBe(0);
		}
	});
});
